from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0007_user_is_team_lead"),
        ("auth", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="GroupProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "section_name",
                    models.CharField(blank=True, default="", max_length=255),
                ),
                (
                    "group",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="profile",
                        to="auth.group",
                    ),
                ),
            ],
        ),
    ]
