from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from django.contrib.auth.hashers import check_password
from .models import User
import jwt, datetime
from django.http import JsonResponse
from django.db import transaction


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email", None)
        if User.objects.filter(email=email).exists():
            raise ValidationError("Error - Email already exists.")
        else:
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed("Error - User not found!")

        if not user.check_password(password):
            raise AuthenticationFailed("Error - Incorrect Password")

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
                "Error - Unauthenticated No Token user dashboard"
            )

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                "Error - Unathenticated Token Expired user dashboard"
            )

        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UsersListView(APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")

        if not token:
            raise AuthenticationFailed("Error - Unauthenticated No Token users list")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                "Error - Unathenticated Token Expired users list"
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
                "Error - Unauthenticated (No Token - Editing profile)"
            )

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            user_id = payload["id"]
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                "Error - Unathenticated Token Expired users list"
            )

        if (
            new_email
            and User.objects.exclude(id=user_id).filter(email=new_email).exists()
        ):
            raise ValidationError("Error - Email already exists.")

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
                "Error - Unauthenticated (No Token - Password reset)"
            )

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
            user_id = payload["id"]
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(
                "Error - Unathenticated Token Expired users list"
            )

        user = User.objects.filter(id=user_id).first()

        if not curr_password:
            raise ValidationError("Error - Current password is required")

        if not check_password(curr_password, user.password):
            raise ValidationError("Error - Incorrect old password")

        try:
            with transaction.atomic():
                user.set_password(new_password)
                user.save()
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)

        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "successfully logged out"}
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {"message": "successfully logged out"}
        return response
