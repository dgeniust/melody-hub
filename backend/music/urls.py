from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SongController,RegisterView, ForgotPasswordView, ResetPasswordConfirmView, ProfileView,ArtistController, AlbumController, PlaylistController, FavoriteSongController, LogoutView, TopSongsChartView, TrendingSongsChartView, TopAlbumsChartView, RecentlyPlayedView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
router = DefaultRouter()
router.register(r'artists', ArtistController, basename='artist')
# URL sinh ra: /api/artists/ và /api/artists/{id}/

router.register(r'albums', AlbumController, basename='album')
# URL sinh ra: /api/albums/ và /api/albums/{id}/

router.register(r'songs', SongController, basename='song')
# URL sinh ra: /api/songs/ và /api/songs/{id}/

router.register(r'playlists', PlaylistController, basename='playlist')
# URL sinh ra: /api/playlists/ và /api/playlists/{id}/

router.register(r'favorites', FavoriteSongController, basename='favorite-song')
# URL sinh ra: /api/favorites/ và /api/favorites/{id}/

urlpatterns = [
    path('', include(router.urls)),
    path('charts/top-songs/', TopSongsChartView.as_view(), name='chart_top_songs'),
    path('charts/trending/', TrendingSongsChartView.as_view(), name='chart_trending'),
    path('charts/top-albums/', TopAlbumsChartView.as_view(), name='chart_top_albums'),
    path('me/recently-played/', RecentlyPlayedView.as_view(), name='recently_played'),
    # Đăng ký & Đăng nhập (JWT)
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # API Đăng nhập có sẵn của SimpleJWT
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # API Refresh Token có sẵn

    # Quên mật khẩu
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('auth/reset-password-confirm/', ResetPasswordConfirmView.as_view(), name='reset_password_confirm'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    # Test bảo mật
    path('auth/profile/', ProfileView.as_view(), name='user_profile'),
]