using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services;
using ZedCars.Net8.Services.Interfaces;

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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var newUser = new Admin
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    Username = request.Username,
                    Password = request.Password,
                    Role = "Customer",
                    IsActive = true,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now
                };

                var addedUser = await _adminRepository.CreateAdminAsync(newUser);
                if (addedUser == null)
                    return BadRequest(new { message = "Registration failed" });

                return Ok(new { message = "Registration successful" });
            }
            catch
            {
                return BadRequest(new { message = "Username or email already exists" });
            }
        }

        public class RegisterRequest
        {
            public string FullName { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest request)
        { 
            var userIdClaim = User.FindFirst("AdminId")?.Value;
            if (int.TryParse(userIdClaim, out int adminId))
            {
                await _jwtService.RevokeAllUserTokensAsync(adminId);
            }

            //revoking specific access token

            if (!string.IsNullOrEmpty(request.RefreshToken))
            {
                await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);
            }
            return Ok(new { message = "Logged Out Successfully" });
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
