# Generated by Django 3.2.25 on 2024-07-24 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0023_auto_20240724_1551'),
    ]

    operations = [
        migrations.AddField(
            model_name='transacao',
            name='valor_liquido',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=10),
            preserve_default=False,
        ),
    ]