using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services;
using ZedCars.Net8.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ZedCars.Net8.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAdminRepository _adminRepository;
        private readonly IUserActivityRepository _userActivityRepository;
        private readonly IJwtService _jwtService;

        public AccountController(IAdminRepository adminRepository, IUserActivityRepository userActivityRepository, IJwtService jwtService)
        {
            _adminRepository = adminRepository;
            _userActivityRepository = userActivityRepository;
            _jwtService = jwtService;
        }

        // ============================
        // LOGIN
        // ============================
        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(string username, string password, bool remember = false)
        {
            var admin = await _adminRepository.ValidateAdminAsync(username, password);

            if (admin != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, admin.Username),
                    new Claim(ClaimTypes.Email, admin.Email),
                    new Claim(ClaimTypes.Role, admin.Role),
                    new Claim("FullName", admin.FullName)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = remember,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30)
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties
                );

                // Generate JWT tokens for API usage
                var accessToken = _jwtService.GenerateAccessToken(admin);
                var refreshToken = _jwtService.GenerateRefreshToken();
                await _jwtService.SaveRefreshTokenAsync(admin.AdminId, refreshToken);

                // Store tokens in TempData to pass to client
                TempData["AccessToken"] = accessToken;
                TempData["RefreshToken"] = refreshToken;

                if (admin.Role == "SuperAdmin" || admin.Role == "Manager")
                    return RedirectToAction("Dashboard", "Admin");
                else
                    return RedirectToAction("Index", "Home");
            }


            TempData["ErrorMessage"] = "Invalid login attempt.";
            return View();
        }

        // ============================
        // LOGOUT
        // ============================
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            var username = User.Identity?.Name ?? "Unknown";

            // Revoke JWT tokens if user is authenticated
            if (User.Identity?.IsAuthenticated == true)
            {
                var adminIdClaim = User.FindFirst("AdminId")?.Value;
                if (int.TryParse(adminIdClaim, out int adminId))
                {
                    await _jwtService.RevokeAllUserTokensAsync(adminId);
                }
            }

            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            
            // Set flag to clear tokens on client side
            TempData["ClearTokens"] = "true";
            
            return RedirectToAction("Index", "Home");
        }

        // ============================
        // REGISTER
        // ============================
        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(string fullName, string email, string username, string password)
        {
            var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

            try
            {
                var newUser = new Admin
                {
                    FullName = fullName,
                    Email = email,
                    Username = username,
                    Password = password,
                    Role = "Customer",
                    IsActive = true,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now
                };

                var addedUser = await _adminRepository.CreateAdminAsync(newUser);

                if (addedUser != null)
                {
                    await _userActivityRepository.LogActivityAsync(
                        username,
                        "Registration",
                        $"Customer {fullName} registered successfully with email {email}",
                        userAgent,
                        "Success"
                    );

                    TempData["SuccessMessage"] = "Registration successful! Please login.";
                    return RedirectToAction("Login");
                }
                else
                {
                    await _userActivityRepository.LogActivityAsync(
                        username,
                        "Registration",
                        $"Registration failed for user {fullName} with email {email}",
                        userAgent,
                        "Failed"
                    );

                    TempData["ErrorMessage"] = "Registration failed. Please try again.";
                    return View();
                }
            }
            catch (Exception ex)
            {
                await _userActivityRepository.LogActivityAsync(
                    username,
                    "Registration",
                    $"Registration error for user {fullName}: {ex.Message}",
                    userAgent,
                    "Error"
                );

                TempData["ErrorMessage"] = "Registration failed. Username or email might already exist.";
                return View();
            }
        }

        // ============================
        // JWT LOGIN TEST PAGE
        // ============================
        [HttpGet]
        public IActionResult JwtLogin() => View();
    }
}
