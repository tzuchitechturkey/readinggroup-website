from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0016_user_category_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="totp_verified",
            field=models.BooleanField(default=True),
        ),
    ]
