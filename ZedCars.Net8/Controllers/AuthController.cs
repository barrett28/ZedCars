using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.Services;

namespace ZedCars.Net8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IAdminRepository _adminRepository;

        public AuthController(IAuthService authService, IAdminRepository adminRepository)
        {
            _authService = authService;
            _adminRepository = adminRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request.Username, request.Password);
            
            if (result == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);
            
            if (result == null)
                return Unauthorized(new { message = "Invalid refresh token" });

            return Ok(result);
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
                    IsActive = true
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

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        { 
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            
            if (int.TryParse(userIdClaim, out int adminId))
            {
                await _authService.RevokeTokenAsync(adminId);
            }

            return Ok(new { message = "Logged out successfully" });
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

    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
