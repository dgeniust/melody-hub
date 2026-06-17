from django.db import models
from django.contrib.auth.models import User

class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank = True, null = True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    verified = models.BooleanField(default=False)
    followers = models.IntegerField(help_text="Lượng người theo dõi")
    def __str__(self):
        return self.name

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist_name = models.ForeignKey(Artist, on_delete = models.CASCADE, related_name='songs')
    duration = models.IntegerField(help_text="Thời lượng tính bằng giây")
    audio_file_url = models.URLField(max_length=500)
    cover_image_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.artist_name}"
    
class Genre(models.Model):
    nam = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
    
class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums')
    cover_image_url = models.URLField(max_length=500, blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.artist.name}"
    
class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    cover_image_url = models.URLField(max_length=500, blank=True, null=True)
    is_public = models.BooleanField(default=True, help_text="Chế độ công khai hoặc riêng tư")
    songs = models.ManyToManyField('Song', related_name='playlists', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.user.username}"

class FavoriteSong(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_songs')
    song = models.ForeignKey('Song', on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'song') # Tránh một user thả tim 1 bài nhiều lần