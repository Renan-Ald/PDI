# Generated by Django 3.2.25 on 2024-07-23 02:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0017_profissional'),
    ]

    operations = [
        migrations.AddField(
            model_name='profissional',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]