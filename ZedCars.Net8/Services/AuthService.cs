using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services.Interfaces;

namespace ZedCars.Net8.Services
{
    public class AuthService : IAuthService
    {
        private readonly ZedCarsContext _context;
        private readonly IPasswordHasher<Admin> _passwordHasher;
        private readonly IConfiguration _configuration;

        public AuthService(ZedCarsContext context, IPasswordHasher<Admin> passwordHasher, IConfiguration configuration)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
        }

        public async Task<TokenResponse> LoginAsync(string username, string password)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == username && a.IsActive);
            
            if (admin == null)
                return null!;

            var result = _passwordHasher.VerifyHashedPassword(admin, admin.Password, password);
            
            if (result != PasswordVerificationResult.Success)
                return null!;

            admin.LastLoginDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GenerateTokensAsync(admin);
        }

        public async Task<TokenResponse?> RefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return null;

            var storedToken = await _context.RefreshTokens
                .Include(t => t.Admin)
                .FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked && t.ExpiryDate > DateTime.UtcNow);

            if (storedToken == null || !storedToken.Admin.IsActive)
                return null;

            return await GenerateTokensAsync(storedToken.Admin);
        }

        public async Task RevokeTokenAsync(int adminId)
        {
            var tokens = await _context.RefreshTokens
                .Where(t => t.AdminId == adminId)
                .ToListAsync();

            _context.RefreshTokens.RemoveRange(tokens);
            await _context.SaveChangesAsync();
        }

        private async Task<TokenResponse> GenerateTokensAsync(Admin admin)
        {
            var accessToken = GenerateAccessToken(admin);
            var refreshToken = GenerateRefreshToken();

            var existingToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.AdminId == admin.AdminId);

            if (existingToken != null)
            {
                existingToken.Token = refreshToken;
                existingToken.ExpiryDate = DateTime.UtcNow.AddDays(7);
                existingToken.CreatedDate = DateTime.UtcNow;
                existingToken.IsRevoked = false;
            }
            else
            {
                _context.RefreshTokens.Add(new RefreshToken
                {
                    AdminId = admin.AdminId,
                    Token = refreshToken,
                    ExpiryDate = DateTime.UtcNow.AddDays(7),
                    CreatedDate = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();

            return new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = 86400, // 24 hours
                User = new AdminDto
                {
                    AdminId = admin.AdminId,
                    Username = admin.Username,
                    Email = admin.Email,
                    FullName = admin.FullName,
                    Role = admin.Role
                }
            };
        }

        private string GenerateAccessToken(Admin admin)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, admin.AdminId.ToString()),
                new Claim(ClaimTypes.Name, admin.Username),
                new Claim(ClaimTypes.Email, admin.Email),
                new Claim(ClaimTypes.Role, admin.Role),
                new Claim("FullName", admin.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
