from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0008_groupprofile"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="is_team_lead",
        ),
    ]
