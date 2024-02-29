from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

def rename_avatar(instance, filename):
    # ext = filename.split('.')[-1]
    # filename = f'{uuid.uuid4()}.{ext}'
    return 'avatars/' + filename

class Account(AbstractUser):
    DoesNotExist = None
    bio = models.TextField(max_length=200, blank=True)
    avatar = models.ImageField(upload_to=rename_avatar, null=True, blank=True)
    friends = models.ManyToManyField('self', blank=True, symmetrical=False)
    friend_requests = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='received_friend_requests')
    login_otp = models.CharField(max_length = 255, null=True, blank=True)
    login_otp_used = models.BooleanField(default=True)
    qr_code = models.ImageField(upload_to="qrcode/", blank=True, null=True)
    otp_base32 = models.CharField(max_length=255, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    @property
    def is_valid_otp(self):
        lifespan_in_seconds = 30
        now = datetime.datetime.now(timezone.utc)
        time_diff = now - self.otp_created_at
        time_diff = time_diff.total_seconds()
        if time_diff >= lifespan_in_seconds or self.login_otp_used :
            return False
        return True

class Tournament(models.Model):
	objects = models.Manager()
	name = models.CharField(max_length=40)
	life = models.IntegerField(
		validators=[MinValueValidator(1), MaxValueValidator(5)]
	)
	created_at = models.DateTimeField(auto_now_add=True, null=False)
	started_at = models.DateTimeField(null=True)
	finished_at = models.DateTimeField(null=True)

	player_max = models.IntegerField(
		validators=[MinValueValidator(4), MaxValueValidator(8)]
	)

	player_in = ArrayField(models.CharField(max_length=20)) # Change for ID of players
	# Postgress requirest that the array be retangular so its need to add a blank field if odd

	player_qty = models.IntegerField(
		validators=[MinValueValidator(0), MaxValueValidator(8)],
		default=0
	)

	STATUS_CHOICES = [
		('not_started', 'Not Started'),
		('in_progress', 'In Progress'),
		('finished', 'Finished'),
	]
	status = models.CharField(
		max_length=20,
		choices=STATUS_CHOICES,
		default='not_started',
		blank=False
	)
	# matches = models.ManyToManyField('self', blank=True, symmetrical=False)