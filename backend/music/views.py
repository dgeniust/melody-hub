from rest_framework import viewsets,status, generics
from .models import Artist, Album, Song, Playlist, FavoriteSong, ArtistFollow, StreamHistory
from .serializers import SongSerializer, ArtistSerializer,StreamHistorySerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import RegisterSerializer, ForgotPasswordSerializer, ResetPasswordConfirmSerializer, PlaylistSerializer, FavoriteSongSerializer, AlbumSerializer, SongMinimalSerializer
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta
from django.db.models import F
from django.db import models
class SongController(viewsets.ModelViewSet):
    queryset = Song.objects.filter(is_active=True).select_related('artist','album') # Gọi từ Repository
    serializer_class = SongSerializer # Gắn Request/Response handler vào
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def listen(self, request, pk=None):
        """API /api/songs/{id}/listen/ - Gọi khi bài hát chạy quá 30s"""
        song = self.get_object()
        Song.objects.filter(pk=pk).update(view_count=F('views_count') + 1)
        
        if request.user.is_authenticated:
            StreamHistory.objects.create(
                user=request.user,
                song=song,
                device=request.data.get('device', 'Web'),
                completed=request.data.get('completed', False)
            )
        return Response({"status": "Lượt nghe đã được ghi nhận"}, status=status.HTTP_200_OK)
       
# --- 1. API: TOP BÀI HÁT NGHE NHIỀU NHẤT ---
class TopSongsChartView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """API /api/charts/top-songs/ - Top 10 bài hát nghe nhiều nhất mọi thời đại"""
        limit = int(request.query_params.get('limit', 10))
        top_songs = Song.objects.filter(is_active=True).order_by('-views_count')[:limit]
        serializer = SongMinimalSerializer(top_songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# --- 2. API: NHẠC TRENDING 7 NGÀY QUA (NẶNG NHẤT) ---
class TrendingSongsChartView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """API /api/charts/trending/ - Bài hát hot trong 7 ngày"""
        limit = int(request.query_params.get('limit', 10))
        seven_days_ago = timezone.now() - timedelta(days=7)
        
        # Nhóm và đếm số lượt nghe trong tuần
        trending_songs_id = StreamHistory.objects.filter(listened_at__gte=seven_days_ago)\
            .values('song')\
            .annotate(total_streams=models.Count('id'))\
            .order_by('-total_streams')[:limit]
            
        song_ids = [item['song'] for item in trending_songs_id]
        
        if not song_ids:
            return Response([], status=status.HTTP_200_OK)
            
        # Giữ nguyên thứ tự bảng xếp hạng từ lịch sử
        preserved = models.Case(*[models.When(pk=pk, then=pos) for pos, pk in enumerate(song_ids)])
        trending_songs = Song.objects.filter(pk__in=song_ids).order_by(preserved)
        
        serializer = SongMinimalSerializer(trending_songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# --- 3. API: TOP ALBUM MỚI PHÁT HÀNH ---
class TopAlbumsChartView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """API /api/charts/top-albums/ - Album mới phát hành"""
        limit = int(request.query_params.get('limit', 10))
        top_albums = Album.objects.select_related('artist').order_by('-release_date')[:limit]
        serializer = AlbumSerializer(top_albums, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
class ArtistController(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def profile(self, request, pk=None):
        """API /api/artists/{id}/profile/ - Lấy toàn bộ thông tin trang cá nhân nghệ sĩ"""
        artist = self.get_object()
        # 5 bài hát phổ biến nhất của nghệ sĩ
        popular_songs = Song.objects.filter(artist=artist, is_active=True).order_by('-views_count')[:5]
        # Tất cả album của nghệ sĩ
        albums = Album.objects.filter(artist=artist).order_by('-release_date')
        return Response({
            "artist": ArtistSerializer(artist, context={'request': request}).data,
            "popular_songs": SongMinimalSerializer(popular_songs, many=True).data,
            "albums": AlbumSerializer(albums, many=True, context={'request': request}).data
        }, status=status.HTTP_200_OK)
    def follow(self, request, pk=None):
        """API /api/artists/{id}/follow/ - Theo dõi/Hủy theo dõi ca sĩ"""
        artist = self.get_object()
        user = request.user
        
        follow_relations = ArtistFollow.objects.filter(user=user, artist=artist)
        if follow_relations.exist():
            follow_relations.delete()
            Artist.objects.filter(pk=pk).update(followers=F('followers')-1)
            return Response({"followed": False, "message": "Đã hủy theo dõi nghệ sĩ này"}, status=status.HTTP_200_OK)
        else:
            ArtistFollow.objects.create(user=user, artist=artist)
            Artist.objects.filter(pk=pk).update(followers=F('followers') + 1)
            return Response({"followed": True, "message": "Đã theo dõi nghệ sĩ thành công"}, status=status.HTTP_201_CREATED)
class AlbumController(viewsets.ModelViewSet):
    """
    Controller quản lý Album.
    Tối ưu hiệu năng bằng select_related('artist') để tránh N+1 Query khi hiển thị artist_detail.
    """
    queryset = Album.objects.select_related('artist').all()
    serializer_class = AlbumSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class PlaylistController(viewsets.ModelViewSet):
    """
    Controller quản lý Playlist.
    Tự động gán Playlist cho User đang đăng nhập khi tạo mới.
    """
    queryset = Playlist.objects.select_related('user').prefetch_related('songs').all()
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Khi tạo playlist, tự động lấy user từ request (Token/Session) điền vào cột user trong DB
        serializer.save(user=self.request.user)
        
class FavoriteSongController(viewsets.ModelViewSet):
    """
    Controller quản lý danh sách Bài hát yêu thích.
    Bắt buộc phải đăng nhập (IsAuthenticated) mới được sử dụng.
    """
    serializer_class = FavoriteSongSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Bảo mật: User nào đăng nhập thì CHỈ nhìn thấy danh sách bài hát yêu thích của CHÍNH HỌ
        return FavoriteSong.objects.filter(user=self.request.user).select_related('song__artist')

    def perform_create(self, serializer):
        # Khi User bấm 'Thả tim', hệ thống tự gán user_id là chính họ
        song = serializer.validate_data['song']
        Song.objects.filter(pk=song.pk).update(likes_count=F('likes_count')+1)
        serializer.save(user=self.request.user)
        
    def destroy(self, request, *bind, **kwargs):
        instance = self.get_object()
        Song.objects.filter(pk=instance.song_id).update(likes_count=F('like_count')-1)
        return super().destroy(request, *bind, **kwargs)

class RecentlyPlayedView(generics.ListAPIView):
    serializer_class = StreamHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StreamHistory.objects.filter(user=self.request.user).select_related('song__artist')[:20]
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny] # Cho phép bất kỳ ai cũng vào được
    serializer_class = RegisterSerializer

# 2. API Yêu cầu Quên mật khẩu
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)
            
            # Tạo uid và token bảo mật để đính kèm vào link mail
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            
            # Tạo link giả định gửi về cho React xử lý tiếp
            # Link này sẽ dẫn tới trang nhập mật khẩu mới trên giao diện React
            reset_link = f"http://localhost:5173/reset-password/{uidb64}/{token}/"
            
            # Gửi Email
            send_mail(
                subject="MelodyHub - Đặt lại mật khẩu của bạn",
                message=f"Bấm vào đường link sau để thiết lập mật khẩu mới: {reset_link}",
                from_email="no-reply@melodyhub.com",
                recipient_list=[email],
            )
            return Response({"message": "Link đặt lại mật khẩu đã được gửi vào email của bạn."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3. API Xác nhận mật khẩu mới
class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            new_password = serializer.validated_data['new_password']
            
            # Đổi mật khẩu và lưu
            user.set_password(new_password)
            user.save()
            return Response({"message": "Đổi mật khẩu thành công!"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 4. API Thử nghiệm (Chỉ cho phép user đã đăng nhập lấy dữ liệu)
class ProfileView(APIView):
    permission_classes = [IsAuthenticated] # Bắt buộc phải có Token hợp lệ

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "message": "Chào mừng bạn đến với khu vực VIP của MelodyHub!"
        })
        
class LogoutView(APIView):
    # Chỉ những người đã đăng nhập (có Access Token hợp lệ) mới có quyền gọi API logout
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Lấy chuỗi refresh token từ body của request gửi lên
            refresh_token = request.data.get("refresh")
            
            if not refresh_token:
                return Response(
                    {"error": "Cần cung cấp refresh token để đăng xuất."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Khởi tạo object RefreshToken và đưa nó vào danh sách đen
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Đăng xuất thành công!"}, 
                status=status.HTTP_205_RESET_CONTENT
            )
            
        except TokenError:
            # Trường hợp token gửi lên không hợp lệ hoặc đã nằm trong blacklist sẵn rồi
            return Response(
                {"error": "Token không hợp lệ hoặc đã hết hạn."}, 
                status=status.HTTP_400_BAD_REQUEST
            )