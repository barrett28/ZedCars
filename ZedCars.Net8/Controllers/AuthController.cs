using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZedCars.Net8.Services;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IJwtService _jwtService;

        public AuthController(IAdminRepository adminRepository, IJwtService jwtService)
        {
            _adminRepository = adminRepository;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var admin = await _adminRepository.ValidateAdminAsync(request.Username, request.Password);
            if (admin == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var accessToken = _jwtService.GenerateAccessToken(admin);
            var refreshToken = _jwtService.GenerateRefreshToken();
            
            await _jwtService.SaveRefreshTokenAsync(admin.AdminId, refreshToken);

            return Ok(new
            {
                accessToken,
                refreshToken,
                user = new
                {
                    admin.AdminId,
                    admin.Username,
                    admin.Email,
                    admin.FullName,
                    admin.Role
                }
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var refreshToken = await _jwtService.GetRefreshTokenAsync(request.RefreshToken);
            if (refreshToken == null)
                return Unauthorized(new { message = "Invalid refresh token" });

            var newAccessToken = _jwtService.GenerateAccessToken(refreshToken.Admin);
            var newRefreshToken = _jwtService.GenerateRefreshToken();

            await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);
            await _jwtService.SaveRefreshTokenAsync(refreshToken.AdminId, newRefreshToken);

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }

        [HttpPost("revoke")]
        [Authorize]
        public async Task<IActionResult> Revoke([FromBody] RefreshRequest request)
        {
            await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);
            return Ok(new { message = "Token revoked" });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RefreshRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
