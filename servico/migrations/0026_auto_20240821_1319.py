# Generated by Django 3.2.25 on 2024-08-21 13:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0025_auto_20240821_0443'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bloco',
            old_name='resultado',
            new_name='resultado_id',
        ),
        migrations.RenameField(
            model_name='resultado',
            old_name='avaliacao',
            new_name='avaliacao_id',
        ),
        migrations.RenameField(
            model_name='tarefa',
            old_name='bloco',
            new_name='bloco_id',
        ),
    ]