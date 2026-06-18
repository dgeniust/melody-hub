from django.db import models
from django.contrib.auth.models import User

class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank = True, null = True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    verified = models.BooleanField(default=False)
    followers = models.IntegerField(default=0, help_text="Lượng người theo dõi")
    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
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
class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete = models.CASCADE, related_name='songs')
    album = models.ForeignKey(Album, on_delete=models.SET_NULL, related_name ='songs', blank=True, null=True)
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, related_name='songs', blank=True, null=True)
    duration = models.IntegerField(help_text="Thời lượng tính bằng giây")
    audio_file_url = models.URLField(max_length=500)
    cover_image_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    lyrics = models.TextField(blank=True, null=True, help_text="Lời bài hát (hoặc định dạng LRC để chạy chữ)")
    is_exclusive = models.BooleanField(default=False, help_text="Bài hát độc quyền (Premium mới nghe được)")
    is_active = models.BooleanField(default=True, help_text="Trạng thái ẩn/hiện (phục vụ việc rút bài hát do bản quyền)")
    
    # Số liệu bộ đếm (Tối ưu hóa để render nhanh BXH, Trending không cần COUNT liên tục)
    views_count = models.PositiveIntegerField(default=0, help_text="Tổng lượt nghe hệ thống")
    likes_count = models.PositiveIntegerField(default=0, help_text="Tổng lượt thích")
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
        
class StreamHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stream_history')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='streams')
    listened_at = models.DateTimeField(auto_now_add=True, help_text="Thời điểm nghe")
    device = models.CharField(max_length=50, blank=True, null=True, help_text="Web, Mobile, Desktop")
    completed = models.BooleanField(default=False, help_text="Người dùng có nghe hết >70% thời lượng bài hát không")

    class Meta:
        ordering = ['-listened_at']
    
class ArtistFollow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following_artists')
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='artist_followers')
    followed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artist') # Tránh follow trùng lặp
        
class SongArtistContribution(models.Model):
    ROLE_CHOICES = [
        ('MAIN', 'Ca sĩ chính'),
        ('FEAT', 'Nghệ sĩ kết hợp (Feat)'),
        ('PRODUCER', 'Nhà sản xuất (Producer)'),
        ('LYRICIST', 'Nhạc sĩ sáng tác'),
    ]
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='contributions')
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='contributions')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MAIN')

    class Meta:
        unique_together = ('song', 'artist', 'role')