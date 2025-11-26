using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services.Interfaces
{
    public interface IUserService
    {
        Task<object?> GetUserProfileAsync(int userId);
        Task<bool> UpdateUserProfileAsync(int userId, UpdateProfileRequest request);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }

    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
    }
}
