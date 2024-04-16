from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime
from django.utils import timezone
import uuid
from django.contrib.postgres.fields import ArrayField
from django.db.models import F, Count

def rename_avatar(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return 'avatars/' + filename

class Account(AbstractUser):
	DoesNotExist = None
	bio = models.TextField(max_length=200, blank=True)
	avatar = models.ImageField(upload_to=rename_avatar, null=True, blank=True)
	friends = models.ManyToManyField('self', blank=True, symmetrical=False)
	friend_requests = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='received_friend_requests')
	login_otp = models.CharField(max_length = 255, null=True, blank=True)
	login_otp_used = models.BooleanField(default=False)
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
		validators=[MinValueValidator(4), MaxValueValidator(4)]
	)

	winner = models.CharField(max_length=40);

	STATUS_CHOICES = [
		('not_started', 'Not Started'),
		('in_progress', 'In Progress'),
		('finished', 'Finished'),
		('incomplete', 'Incomplete'),
	]
	status = models.CharField(
		max_length=20,
		choices=STATUS_CHOICES,
		default='Not Started',
		blank=False
	)
	# matchs = models.ManyToManyField('self', blank=True, symmetrical=False)

class Player(models.Model):
    class Meta:
        verbose_name = 'Player'
        verbose_name_plural = 'Players'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    playing = models.BooleanField(default=False)
    user = models.OneToOneField(Account, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f' {self.user.username}'
	
    @property
    def wins_and_losses_count(self):
        matches_left = self.matches_as_left_player.all().filter(status="finished")
        matches_right = self.matches_as_right_player.all().filter(status="finished")
        wins = matches_left.filter(left_score=F('max_score')).count() + matches_right.filter(right_score=F('max_score')).count()
        losses = matches_left.count() + matches_right.count() - wins
        return wins, losses


class Match(models.Model):
    class Meta:
        verbose_name = 'Match'
        verbose_name_plural = 'Matches'

    class MatchStatus(models.TextChoices):
        CREATED = "created"
        PLAYING = "playing"
        FINISHED = "finished"
        PAUSED = "paused"
        CANCELLED = "cancelled"
	
    class MatchType(models.TextChoices):
        LOCAL = "local"
        REMOTE = "remote"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    left_player = models.ForeignKey(Player, related_name='matches_as_left_player', null=True, on_delete=models.SET_NULL)
    right_player = models.ForeignKey(Player, related_name='matches_as_right_player', null=True, on_delete=models.SET_NULL)
    status = models.CharField(choices=MatchStatus.choices, default=MatchStatus.CREATED)
    left_score = models.PositiveSmallIntegerField(default=0)
    right_score = models.PositiveSmallIntegerField(default=0)
    max_score = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(choices=MatchType.choices)
    tournament_id = models.IntegerField(default=-1)
	
    def __str__(self):
        return f'{self.left_player} vs. {self.right_player}'