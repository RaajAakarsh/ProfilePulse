from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    UserView,
    LogoutView,
    UsersListView,
    EditProfileView,
    PasswordResetView,
    ForgotPasswordView,

    activate_user,
    reset_forgot_password
)

urlpatterns = [
    path("register", RegisterView.as_view()),
    path("login", LoginView.as_view()),
    path("user", UserView.as_view()),
    path("logout", LogoutView.as_view()),
    path("usersfetch", UsersListView.as_view()),
    path("editProfile", EditProfileView.as_view()),
    path("passwordReset", PasswordResetView.as_view()),
    path("forgotPassword", ForgotPasswordView.as_view()),

    path('activate_user/<uidb64>/<token>', activate_user, name = 'activate'),
    path('reset_forgot_password/<uidb64>/<token>', reset_forgot_password, name = 'reset'),
]