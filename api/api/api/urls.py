from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import UsuarioViewSet, RecetaViewSet, CategoriaViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'recetas',  RecetaViewSet,  basename='recetas')
router.register(r'categorias', CategoriaViewSet, basename='categorias')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
]
