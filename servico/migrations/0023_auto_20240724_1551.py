# Generated by Django 3.2.25 on 2024-07-24 15:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('servico', '0022_detalhepedido_valor_liquido'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='detalhepedido',
            name='valor_liquido',
        ),
        migrations.RemoveField(
            model_name='transacao',
            name='valor_liquido',
        ),
    ]
