from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SessionViewSet, LoggedInSessionView

router = DefaultRouter()
router.register(r'sessions', SessionViewSet, basename='sessions')  

urlpatterns = [
    path('', include(router.urls)),
    path("logout/", LoggedInSessionView.as_view(), name="logout_session"),  
]
