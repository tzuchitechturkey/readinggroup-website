import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0022_rename_sub_title_historyevent_sub_title_one_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="video",
            name="base_video",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="translations",
                to="content.video",
            ),
        ),
    ]
