using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services.Interfaces
{
    public interface IAuthService
    {
        Task<TokenResponse> LoginAsync(string username, string password);
        Task<TokenResponse?> RefreshTokenAsync(string refreshToken);
        Task RevokeTokenAsync(int adminId);
    }

    public class TokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
        public AdminDto User { get; set; } = null!;
    }

    public class AdminDto
    {
        public int AdminId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
