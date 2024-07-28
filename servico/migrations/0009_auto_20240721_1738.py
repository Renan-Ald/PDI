# Generated by Django 3.2.25 on 2024-07-21 17:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0008_alter_carrinho_usuario'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemcarrinho',
            name='carrinho',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itens', to='servico.carrinho'),
        ),
        migrations.AlterField(
            model_name='itemcarrinho',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='itens_carrinho', to=settings.AUTH_USER_MODEL),
        ),
    ]