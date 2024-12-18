# Generated by Django 3.2.25 on 2024-12-18 16:39

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0026_auto_20240821_1319'),
    ]

    operations = [
        migrations.AddField(
            model_name='servico',
            name='descricao_longo',
            field=models.TextField(default=datetime.datetime(2024, 12, 18, 16, 39, 25, 865856, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='servico',
            name='descricao',
            field=models.TextField(max_length=30),
        ),
    ]
