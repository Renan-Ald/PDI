# Generated by Django 3.2.25 on 2024-07-23 00:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0014_avaliacao'),
    ]

    operations = [
        migrations.RenameField(
            model_name='avaliacao',
            old_name='compra',
            new_name='Pagamento',
        ),
    ]