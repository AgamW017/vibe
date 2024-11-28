# Generated by Django 4.2.16 on 2024-11-28 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content_type', models.CharField(help_text='Type of content: question, video, article, etc.', max_length=50)),
                ('content_id', models.PositiveIntegerField(help_text='ID of the associated content')),
                ('feedback_type', models.CharField(choices=[('Suggestion', 'Suggestion'), ('Issue', 'Issue')], max_length=50)),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
