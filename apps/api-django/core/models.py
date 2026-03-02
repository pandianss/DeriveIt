from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    TIER_CHOICES = [
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('institutional', 'Institutional'),
    ]
    ROLE_CHOICES = [
        ('learner', 'Learner'),
        ('admin', 'System Administrator'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    avatar = models.URLField(blank=True, null=True)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='free')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='learner')
    lang_pref = models.CharField(max_length=10, default='en')
    last_active = models.DateTimeField(auto_now=True)

class Subscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    stripe_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    plan = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    expires_at = models.DateTimeField(null=True, blank=True)

class TopicEnrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic_id = models.CharField(max_length=255) # Refers to MongoDB Topic ID
    enrolled_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='active')

class ModuleProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module_id = models.CharField(max_length=255) # Refers to MongoDB Module ID
    attempts = models.IntegerField(default=0)
    last_score = models.FloatField(null=True, blank=True)
    best_score = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=50, default='locked') # locked, unlocked, in_progress, completed
    unlocked_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

class AssessmentSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module_id = models.CharField(max_length=255)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    questions_json = models.JSONField(default=list)
    answers_json = models.JSONField(default=dict)
    valid = models.BooleanField(default=True)

class GamificationLedger(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event_type = models.CharField(max_length=100)
    points_delta = models.IntegerField()
    balance = models.IntegerField()
    ref_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Streak(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)

class Badge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    badge_type = models.CharField(max_length=100)
    ref_id = models.CharField(max_length=255, null=True, blank=True)
    awarded_at = models.DateTimeField(auto_now_add=True)

class LeaderboardWeekly(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    week_start = models.DateField()
    points = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
