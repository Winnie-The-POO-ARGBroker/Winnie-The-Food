from django.db import models

class Categorias(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)
    imagen = models.CharField(max_length=600, blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'categorias'

class Dificultades(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=50)
    class Meta:
        managed = False
        db_table = 'dificultades'

class Tipos(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)
    class Meta:
        managed = False
        db_table = 'tipos'

class Usuarios(models.Model):
    id = models.CharField(primary_key=True, max_length=64)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=5)
    creado_en = models.DateTimeField()
    class Meta:
        managed = False
        db_table = 'usuarios'

class Recetas(models.Model):
    id = models.IntegerField(primary_key=True)
    autor = models.ForeignKey('Usuarios', on_delete=models.PROTECT, db_column='autor_id')
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    porciones = models.IntegerField(blank=True, null=True)
    tiempo_prep = models.IntegerField(blank=True, null=True)
    tiempo_coc = models.IntegerField(blank=True, null=True)
    categoria = models.ForeignKey('Categorias', on_delete=models.SET_NULL, blank=True, null=True)
    dificultad = models.ForeignKey('Dificultades', on_delete=models.SET_NULL, blank=True, null=True)
    tipo = models.ForeignKey('Tipos', on_delete=models.SET_NULL, blank=True, null=True)
    publicada = models.BooleanField()
    image_url = models.CharField(max_length=600, blank=True, null=True)
    enlace = models.CharField(max_length=255, blank=True, null=True)
    creado_en = models.DateTimeField()
    class Meta:
        managed = False
        db_table = 'recetas'

class RecetaIngredients(models.Model):
    id = models.BigAutoField(primary_key=True)
    receta = models.ForeignKey('Recetas', on_delete=models.CASCADE, db_column='receta_id')
    orden = models.IntegerField()
    texto = models.CharField(max_length=512)
    class Meta:
        managed = False
        db_table = 'receta_ingredients'
        indexes = [models.Index(fields=['receta','orden'])]

class RecetaSteps(models.Model):
    id = models.BigAutoField(primary_key=True)
    receta = models.ForeignKey('Recetas', on_delete=models.CASCADE, db_column='receta_id')
    orden = models.IntegerField()
    texto = models.CharField(max_length=512)
    class Meta:
        managed = False
        db_table = 'receta_steps'
        indexes = [models.Index(fields=['receta','orden'])]

class RecetaTips(models.Model):
    id = models.BigAutoField(primary_key=True)
    receta = models.ForeignKey('Recetas', on_delete=models.CASCADE, db_column='receta_id')
    orden = models.IntegerField()
    texto = models.CharField(max_length=512)
    class Meta:
        managed = False
        db_table = 'receta_tips'

class Tags(models.Model):
    id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(unique=True, max_length=100)
    class Meta:
        managed = False
        db_table = 'tags'

class RecetaTags(models.Model):
    receta = models.ForeignKey('Recetas', on_delete=models.CASCADE, db_column='receta_id', primary_key=True)
    tag = models.ForeignKey('Tags', on_delete=models.RESTRICT, db_column='tag_id')
    class Meta:
        managed = False
        db_table = 'receta_tags'
        unique_together = (('receta', 'tag'),)
        indexes = [models.Index(fields=['receta']), models.Index(fields=['tag'])]

class RecetaNutrition(models.Model):
    id = models.BigAutoField(primary_key=True)
    receta = models.ForeignKey('Recetas', on_delete=models.CASCADE)
    label = models.CharField(max_length=100)
    value_num = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'receta_nutrition'

class RecetaRelated(models.Model):
    id = models.BigAutoField(primary_key=True)
    receta = models.ForeignKey('Recetas', on_delete=models.CASCADE)
    titulo = models.CharField(max_length=255)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    tiempo = models.CharField(max_length=50, blank=True, null=True)
    dificultad = models.CharField(max_length=50, blank=True, null=True)
    imagen = models.CharField(max_length=512, blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'receta_related'

class Favoritos(models.Model):
    usuario = models.ForeignKey('Usuarios', on_delete=models.CASCADE, db_column='usuario_id', primary_key=True)
    receta = models.ForeignKey('Recetas', on_delete=models.CASCADE, db_column='receta_id')
    creado_en = models.DateTimeField()
    class Meta:
        managed = False
        db_table = 'favoritos'
        unique_together = (('usuario', 'receta'),)
        indexes = [models.Index(fields=['usuario']), models.Index(fields=['receta'])]

class Sesiones(models.Model):
    id = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey('Usuarios', on_delete=models.CASCADE)
    token = models.CharField(unique=True, max_length=255)
    creado_en = models.DateTimeField()
    expira_en = models.DateTimeField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'sesiones'
