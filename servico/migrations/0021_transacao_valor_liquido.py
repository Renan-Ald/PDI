# Generated by Django 3.2.25 on 2024-07-24 01:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0020_auto_20240724_0107'),
    ]

    operations = [
        migrations.AddField(
            model_name='transacao',
            name='valor_liquido',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=10),
            preserve_default=False,
        ),
    ]