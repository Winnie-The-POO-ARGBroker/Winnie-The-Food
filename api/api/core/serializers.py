from uuid import uuid4
from django.db import transaction
from django.db.models import Max
from rest_framework import serializers

from .models import (
    Usuarios, Recetas, Categorias, Dificultades, Tags,
    RecetaIngredients, RecetaSteps, RecetaNutrition, RecetaTips, RecetaRelated, RecetaTags
)

# ---------------- Usuarios ----------------
class UsuarioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id','nombre','apellido','email','password','role','creado_en']
        extra_kwargs = {'id': {'required': False}}

    def create(self, vd):
        return super().create(vd)


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id','nombre','apellido','email','role','creado_en']


# ---------------- Categorías ----------------
class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = ['id', 'nombre', 'imagen']


# ---------------- Helpers ----------------
def _resolve_user(initial):
    """Admite {'autor': {'id': '...'}} o {'autor_id': '...'}."""
    autor_id = None
    if isinstance(initial.get('autor'), dict):
        autor_id = initial['autor'].get('id')
    autor_id = autor_id or initial.get('autor_id')
    if not autor_id:
        raise serializers.ValidationError({'autor': 'autor.id es requerido'})
    try:
        return Usuarios.objects.get(id=str(autor_id))
    except Usuarios.DoesNotExist:
        raise serializers.ValidationError({'autor': 'usuario inexistente'})

def _resolve_categoria(raw):
    """Admite id (int/str) o None/'' => None."""
    if raw in (None, ''):
        return None
    try:
        cid = int(raw)
        return Categorias.objects.filter(id=cid).first()
    except (ValueError, TypeError):
        return Categorias.objects.filter(nombre__iexact=str(raw)).first()

def _resolve_dificultad(raw):
    """Admite 1/2/3 o 'facil'/'medio'/'media'/'dificil'."""
    if raw in (None, '', 0, '0'):
        return None
    try:
        did = int(raw)
        obj = Dificultades.objects.filter(id=did).first()
        if obj:
            return obj
    except (ValueError, TypeError):
        pass
    s = str(raw).lower().strip()
    if s in ('1','facil'):   name = 'facil'
    elif s in ('2','medio','media'): name = 'medio'
    else:                    name = 'dificil'
    return Dificultades.objects.filter(nombre__iexact=name).first()

def _get_or_create_tag_case_insensitive(name: str):
    """Obtiene tag por nombre case-insensitive; si no existe lo crea con el nombre exacto dado."""
    n = name.strip()
    if not n:
        return None
    existing = Tags.objects.filter(nombre__iexact=n).first()
    if existing:
        return existing
    return Tags.objects.create(nombre=n)

def _upsert_tags(receta: Recetas, tags_list):
    """Reemplaza los tags de la receta con los de tags_list (array de strings)."""
    if tags_list is None:
        return
    RecetaTags.objects.filter(receta=receta).delete()
    bulk = []
    for t in tags_list:
        tag = _get_or_create_tag_case_insensitive(str(t))
        if tag:
            bulk.append(RecetaTags(receta=receta, tag=tag))
    if bulk:
        RecetaTags.objects.bulk_create(bulk)

def _replace_child_rows(receta: Recetas, model, rows, fields_map):
    """
    Borra e inserta filas hijo.
    fields_map: { 'payload_key': 'model_field', ... }
    """
    model.objects.filter(receta=receta).delete()
    bulk = []
    for r in (rows or []):
        data = {'receta': receta}
        for src, dst in fields_map.items():
            data[dst] = r.get(src)
        bulk.append(model(**data))
    if bulk:
        model.objects.bulk_create(bulk)


# ---------------- Recetas (lista) ----------------
class RecetaSerializer(serializers.ModelSerializer):
    # mapping camelCase de salida
    autor_id   = serializers.CharField(source='autor.id', read_only=True)
    imageUrl   = serializers.CharField(source='image_url', allow_null=True, required=False)
    tiempoPrep = serializers.IntegerField(source='tiempo_prep', required=False, allow_null=True)
    tiempoCoc  = serializers.IntegerField(source='tiempo_coc',  required=False, allow_null=True)

    class Meta:
        model = Recetas
        fields = ['id','autor_id','nombre','descripcion','porciones',
                  'tiempoPrep','tiempoCoc','categoria','dificultad',
                  'tipo','publicada','imageUrl','enlace','creado_en']
        extra_kwargs = {
            'id': {'required': False},
            'creado_en': {'required': False, 'read_only': False},  # <- que NO lo exija
        }

    # ----- CREATE/UPDATE base (sin hijos) -----
    def create(self, vd):
        if not vd.get('id'):
            max_id = Recetas.objects.aggregate(m=Max('id'))['m'] or 0
            vd['id'] = max_id + 1

        initial = getattr(self, 'initial_data', {}) or {}
        vd['autor'] = _resolve_user(initial)

        cat = _resolve_categoria(initial.get('categoria'))
        if cat is not None:
            vd['categoria'] = cat

        dif = _resolve_dificultad(initial.get('dificultad'))
        if dif is not None:
            vd['dificultad'] = dif

        return super().create(vd)

    def update(self, instance, vd):
        initial = getattr(self, 'initial_data', {}) or {}

        if 'autor' in initial or 'autor_id' in initial:
            instance.autor = _resolve_user(initial)

        if 'categoria' in initial:
            instance.categoria = _resolve_categoria(initial.get('categoria'))

        if 'dificultad' in initial:
            instance.dificultad = _resolve_dificultad(initial.get('dificultad'))

        for f in ['nombre','descripcion','porciones','tipo','publicada','image_url','tiempo_prep','tiempo_coc','enlace']:
            if f in vd:
                setattr(instance, f, vd[f])

        instance.save()
        return instance


# ---------------- Recetas (detalle con hijos) ----------------
class RecetaDetailSerializer(RecetaSerializer):
    ingredients = serializers.SerializerMethodField()
    steps       = serializers.SerializerMethodField()
    nutrition   = serializers.SerializerMethodField()
    tips        = serializers.SerializerMethodField()
    related     = serializers.SerializerMethodField()
    tags        = serializers.SerializerMethodField()

    class Meta(RecetaSerializer.Meta):
        fields = RecetaSerializer.Meta.fields + [
            'ingredients', 'steps', 'nutrition', 'tips', 'related', 'tags'
        ]

    # ---- GET hijos ----
    def get_ingredients(self, obj):
        return list(
            RecetaIngredients.objects
            .filter(receta=obj).order_by('orden')
            .values('orden','texto')
        )

    def get_steps(self, obj):
        return list(
            RecetaSteps.objects
            .filter(receta=obj).order_by('orden')
            .values('orden','texto')
        )

    def get_nutrition(self, obj):
        rows = RecetaNutrition.objects.filter(receta=obj).values('label','value_num')
        return [{'label': r['label'], 'valueNum': r['value_num'] } for r in rows]

    def get_tips(self, obj):
        return list(
            RecetaTips.objects
            .filter(receta=obj).order_by('orden')
            .values('orden','texto')
        )

    def get_related(self, obj):
        return list(
            RecetaRelated.objects
            .filter(receta=obj)
            .values('titulo','descripcion','tiempo','dificultad','imagen')
        )

    def get_tags(self, obj):
        q = RecetaTags.objects.filter(receta=obj).select_related('tag')
        return [rt.tag.nombre for rt in q]

    # ---- CREATE/UPDATE con hijos ----
    @transaction.atomic
    def create(self, vd):
        req = self.context.get('request')
        data = req.data if req else {}
        ingredients = data.get('ingredients') or []
        steps       = data.get('steps') or []
        tips        = data.get('tips') or []
        nutrition   = data.get('nutrition') or []
        related     = data.get('related') or []
        tags        = data.get('tags') or []

        receta = super().create(vd)

        _replace_child_rows(receta, RecetaIngredients, ingredients, {'orden':'orden','texto':'texto'})
        _replace_child_rows(receta, RecetaSteps,       steps,       {'orden':'orden','texto':'texto'})
        _replace_child_rows(receta, RecetaTips,        tips,        {'orden':'orden','texto':'texto'})
        _replace_child_rows(receta, RecetaNutrition,   nutrition,   {'label':'label','valueNum':'value_num'})
        _replace_child_rows(receta, RecetaRelated,     related,     {'titulo':'titulo','descripcion':'descripcion','tiempo':'tiempo','dificultad':'dificultad','imagen':'imagen'})
        _upsert_tags(receta, tags)

        return receta

    @transaction.atomic
    def update(self, instance, vd):
        req = self.context.get('request')
        data = req.data if req else {}

        ingredients = data.get('ingredients', None)
        steps       = data.get('steps', None)
        tips        = data.get('tips', None)
        nutrition   = data.get('nutrition', None)
        related     = data.get('related', None)
        tags        = data.get('tags', None)

        receta = super().update(instance, vd)

        if ingredients is not None:
            _replace_child_rows(receta, RecetaIngredients, ingredients, {'orden':'orden','texto':'texto'})
        if steps is not None:
            _replace_child_rows(receta, RecetaSteps, steps, {'orden':'orden','texto':'texto'})
        if tips is not None:
            _replace_child_rows(receta, RecetaTips, tips, {'orden':'orden','texto':'texto'})
        if nutrition is not None:
            _replace_child_rows(receta, RecetaNutrition, nutrition, {'label':'label','valueNum':'value_num'})
        if related is not None:
            _replace_child_rows(receta, RecetaRelated, related, {'titulo':'titulo','descripcion':'descripcion','tiempo':'tiempo','dificultad':'dificultad','imagen':'imagen'})
        if tags is not None:
            _upsert_tags(receta, tags)

        return receta
