from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from rest_framework.views import APIView
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.core.mail import EmailMessage
from .serializers import UserSerializer
from django.http import JsonResponse
from django.conf import settings
from django.db import transaction
from .models import User
from .utils import generate_token
import jwt, datetime


def send_activation_email(user, request, domain):
    current_site = domain
    email_subject = "Activate your account"
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

    activation_link = f"http://{current_site}/activate_user/{uidb64}/{generate_token.make_token(user)}"
    email_body = f"""
        Hi {user.name}!

        Thankyou for joining our community.
        Please use the link below to verify your account:

        {activation_link}
    """
    email = EmailMessage(
        subject=email_subject,
        body=email_body,
        from_email=settings.EMAIL_FROM_USER,
        to=[user.email],
    )
    try:
        email.send(fail_silently=False)
        return {"detail": "Activation email sent successfully"}

    except Exception as e:
        raise ValidationError({"detail": "Error - Activation email not sent!"})


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email", None)
        frontend_domain = request.data.get("frontendDomain", None)
        if User.objects.filter(email=email).exists():
            raise ValidationError({"detail": "Email already exists"})

        else:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            user = User.objects.filter(email=email).first()
            response_data = send_activation_email(user, request, frontend_domain)
            return Response(response_data)


class LoginView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed({"detail": "Error - User not found!"})

        if not user.check_password(password):
            raise AuthenticationFailed({"detail": "Error - Incorrect Password"})

        if not user.is_email_verified:
            raise AuthenticationFailed(
                {"detail": "Error - Email not verified, Please check your email inbox!"}
            )

        payload = {
            "id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            "iat": datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, "secret", algorithm="HS256")
        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=True)
        response.data = {"jwt": token}
        return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed(
                {"detail": "Error - Unauthenticated No Token user dashboard"}
            )

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                {"detail": "Error - Unathenticated Token Expired user dashboard"}
            )

        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UsersListView(APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed(
                {"detail": "Error - Unauthenticated No Token users list"}
            )

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                {"detail": "Error - Unathenticated Token Expired users list"}
            )

        users = User.objects.all()
        serialized_users = UserSerializer(users, many=True)
        return Response(serialized_users.data)


class EditProfileView(APIView):
    def post(self, request):
        new_username = request.data["username"]
        new_email = request.data["email"]
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed(
                {"detail": "Error - Unauthenticated (No Token - Editing profile)"}
            )

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            user_id = payload["id"]
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                {"detail": "Error - Unathenticated Token Expired users list"}
            )

        if (
            new_email
            and User.objects.exclude(id=user_id).filter(email=new_email).exists()
        ):
            raise ValidationError({"detail": "Error - Email already exists."})

        try:
            with transaction.atomic():
                user = User.objects.select_for_update().get(pk=user_id)
                if new_username:
                    user.name = new_username
                if new_email:
                    user.email = new_email
                user.save()
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)

        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class PasswordResetView(APIView):
    def post(self, request):
        curr_password = request.data["currPassword"]
        new_password = request.data["newPassword"]
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed(
                {"detail": "Error - Unauthenticated (No Token - Password reset)"}
            )

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            user_id = payload["id"]
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                {"detail": "Error - Unathenticated Token Expired users list"}
            )

        user = User.objects.filter(id=user_id).first()

        if not curr_password:
            raise ValidationError({"detail": "Error - Current password is required"})

        if not check_password(curr_password, user.password):
            raise ValidationError({"detail": "Error - Incorrect old password"})

        try:
            with transaction.atomic():
                user.set_password(new_password)
                user.save()
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)

        response = Response()
        response.delete_cookie("jwt")
        response.data = {"detail": "successfully logged out"}
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"detail": "successfully logged out"}
        return response


def activate_user(request, uidb64, token):
    response = Response()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception as e:
        user = None
    if user and generate_token.check_token(user, token):
        user.is_email_verified = True
        user.save()

        return JsonResponse(
            {"detail": "Email verified you can now log in!"}, status=203
        )
    else:
        return JsonResponse({"detail": "Account activation failed!"}, status=403)


class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email", None)
        frontend_domain = request.data.get("frontendDomain", None)
        if User.objects.filter(email=email).exists():
            user = User.objects.filter(email=email).first()
            response_data = send_forgotPassword_email(user, request, frontend_domain)
        else:
            raise ValidationError({"detail": "Email does not exist"})

        return Response(response_data)


def send_forgotPassword_email(user, request, domain):
    current_site = domain
    email_subject = "Forgot Password"
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))

    activation_link = f"http://{current_site}/reset_forgot_password/{uidb64}/{generate_token.make_token(user)}"
    email_body = f"""
        Hi {user.name}!

        Looks like you have forgotten your password!
        Please use the link below to reset the password to your account.

        {activation_link}
    """
    email = EmailMessage(
        subject=email_subject,
        body=email_body,
        from_email=settings.EMAIL_FROM_USER,
        to=[user.email],
    )
    try:
        email.send(fail_silently=False)
        return {"detail": "ForgottenPassword Activation email sent successfully"}

    except Exception as e:
        raise ValidationError(
            {"detail": "Error - ForgottenPassword Activation email not sent!"}
        )

@api_view(['POST'])
def reset_forgot_password(request, uidb64, token):
    response = Response()
    newPassword = request.data.get("newPassword", None)
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.filter(id=uid).first()
    except Exception as e:
        user = None

    if user and generate_token.check_token(user, token):
        with transaction.atomic():
            user.set_password(newPassword)
            user.save()
            return JsonResponse(
                {
                    "detail": "Password has been successffully reset, you can now log in!"
                },
                status=203,
            )
    else:
        return JsonResponse({"detail": "Password Reset failed!"}, status=403)
