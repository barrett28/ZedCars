using System.Security.Claims;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateAccessToken(Admin admin);
        string GenerateRefreshToken();
        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
        Task<RefreshToken> SaveRefreshTokenAsync(int adminId, string token);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
        Task RevokeRefreshTokenAsync(string token);
        Task RevokeAllUserTokensAsync(int adminId);
    }
}
