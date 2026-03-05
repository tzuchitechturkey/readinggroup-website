# Generated manually on 2026-03-05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0003_fix_thumbnail_url_typo"),
    ]

    operations = [
        migrations.AddField(
            model_name="latestnews",
            name="is_test",
            field=models.BooleanField(default=False),
        ),
    ]
