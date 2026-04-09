import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0031_eventcommunity_language"),
    ]

    operations = [
        migrations.AddField(
            model_name="eventcommunity",
            name="base_event",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="translations",
                to="content.eventcommunity",
            ),
        ),
    ]
