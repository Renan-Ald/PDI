# Generated by Django 3.2.25 on 2024-07-21 21:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0011_auto_20240721_2028'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pagamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_pagamento', models.DateTimeField(blank=True, null=True)),
                ('valor_original', models.DecimalField(decimal_places=2, max_digits=10)),
                ('valor_liquido', models.DecimalField(decimal_places=2, max_digits=10)),
                ('desconto', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ('status', models.CharField(choices=[('pendente', 'Pendente'), ('concluido', 'Concluído')], default='pendente', max_length=20)),
                ('servico', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='servico.servico')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]