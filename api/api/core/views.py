# core/views.py
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Usuarios, Recetas, Categorias
from .serializers import (
    UsuarioSerializer, UsuarioCreateSerializer,
    RecetaSerializer, RecetaDetailSerializer, CategoriaSerializer
)

def apply_sorting(qs, request):
    sort = request.query_params.get('_sort')
    order = request.query_params.get('_order', 'asc')
    if sort:
        if order.lower() == 'desc':
            sort = f'-{sort}'
        qs = qs.order_by(sort)
    return qs

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all().order_by('-creado_en')
    permission_classes = [AllowAny]
    pagination_class = None

    def get_serializer_class(self):
        return UsuarioCreateSerializer if self.action == 'create' else UsuarioSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        email = self.request.query_params.get('email')
        if email:
            qs = qs.filter(email__iexact=email)
        return apply_sorting(qs, self.request)

class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Recetas.objects.all()
    permission_classes = [AllowAny]
    pagination_class = None

    def get_serializer_class(self):
        if self.action in ('list',):
            return RecetaSerializer
        return RecetaDetailSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        autor_id = self.request.query_params.get('autor_id')
        categoria = self.request.query_params.get('categoria')
        if autor_id:
            qs = qs.filter(autor__id=str(autor_id))
        if categoria:
            qs = qs.filter(categoria__in=Categorias.objects
                           .filter(nombre=categoria).values('id'))
        return apply_sorting(qs, self.request)

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categorias.objects.all().order_by('id')
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]
    pagination_class = None
