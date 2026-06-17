from rest_framework import serializers
from .models import Song, Artist, Genre, Album, Playlist, FavoriteSong
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

class UserMinifiedSerializer(serializers.ModelSerializer):
    """Serializer gọn nhẹ dùng để hiển thị thông tin User ở các API khác"""
    class Meta:
        model = User
        fields = ['id', 'username']
class ArtistSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Artist
        fields =['id', 'name', 'bio', 'avatar_url', 'verified', 'followers']
        read_only_fields = ['id']
        extra_kwargs = {'followers' : {'default':0}}
        
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']
        
class AlbumSerializer(serializers.ModelSerializer):
    artist_detail = ArtistSerializer(source = 'artist', read_only=True)
    
    class Meta: 
        model = Album
        fields = ['id', 'title', 'artist', 'artist_detail', 'cover_image_url', 'release_date', 'created_at']
        read_only_fields = ['id', 'created_at']
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email này đã được sử dụng.")
        return value

    def create(self, validated_data):
        # Sử dụng create_user để mật khẩu tự động được mã hóa (hashing)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
class SongSerializer(serializers.ModelSerializer):
    artist_detail = ArtistSerializer(source ='artist_name', read_only=True)
    duration_formatted = serializers.SerializerMethodField()
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist_name', 'artist_detail', 'duration', 'duration_formatted', 'audio_file_url', 'cover_image_url', 'created_at']
        read_only_fields = ['id', 'created_at']

    # Custom validate request nếu cần (Ví dụ: thời lượng không được âm)
    def validate_duration(self, value):
        if value <= 0:
            raise serializers.ValidationError("Thời lượng bài hát phải lớn hơn 0 giây.")
        return value
    def get_duration_formatted(self, obj):
        minutes = obj.duration // 60
        seconds = obj.duration % 60
        return f"{minutes}:{seconds:02d}"

class PlaylistSerializer(serializers.ModelSerializer):
    user_detail = UserMinifiedSerializer(source='user', read_only=True)
    songs_detail = SongSerializer(source='songs', many=True, read_only=True)
    class Meta:
        model = Playlist
        fields = ['id', 'user', 'user_detail', 'title', 'description', 
            'cover_image_url', 'is_public', 'songs', 'songs_detail', 'created_at']
        read_only_fields = ['id', 'created_at']
        
class FavoriteSongSerializer(serializers.ModelSerializer):
    song_detail = SongSerializer(source='song', read_only=True)

    class Meta:
        model = FavoriteSong
        fields = ['id', 'user', 'song', 'song_detail', 'liked_at']
        read_only_fields = ['id', 'liked_at']

    def validate(self, attrs):
        # Kiểm tra trùng lặp thủ công nếu muốn báo lỗi tường minh hơn thay vì lỗi DB IntegrityError
        user = attrs.get('user')
        song = attrs.get('song')
        if FavoriteSong.objects.filter(user=user, song=song).exists():
            raise serializers.ValidationError("Bài hát này đã nằm trong danh sách yêu thích của bạn.")
        return attrs
# 2. Serializer Yêu cầu Đặt lại mật khẩu (Quên mật khẩu)
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Không tìm thấy tài khoản nào với email này.")
        return value

# 3. Serializer Xác nhận đổi mật khẩu mới
class ResetPasswordConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        try:
            # Giải mã ID người dùng từ chuỗi mã hóa trong link email
            uid = force_str(urlsafe_base64_decode(data['uidb64']))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Đường dẫn không hợp lệ hoặc đã hết hạn.")

        # Kiểm tra tính hợp lệ của Token đi kèm
        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Token không hợp lệ hoặc đã hết hạn.")

        data['user'] = user
        return data