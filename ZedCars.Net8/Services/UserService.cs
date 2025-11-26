using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services
{
    public class UserService : IUserService
    {
        private readonly IAdminRepository _adminRepository;

        public UserService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<object?> GetUserProfileAsync(int userId)
        {
            var user = await _adminRepository.GetAdminByIdAsync(userId);
            
            if (user == null) return null;

            return new
            {
                user.AdminId,
                user.Username,
                user.FullName,
                user.Email,
                user.Department,
                user.Role,
                user.PhoneNumber,
                user.Address,
                user.IsActive,
                user.CreatedDate,
                user.LastLoginDate
            };
        }

        public async Task<bool> UpdateUserProfileAsync(int userId, UpdateProfileRequest request)
        {
            var user = await _adminRepository.GetAdminByIdAsync(userId);
            
            if (user == null) return false;

            user.FullName = request.FullName ?? user.FullName;
            user.Email = request.Email ?? user.Email;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.Address = request.Address ?? user.Address;
            user.ModifiedDate = DateTime.Now;

            var updated = await _adminRepository.UpdateAdminAsync(user);
            return updated != null;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _adminRepository.GetAdminByIdAsync(userId);
            
            if (user == null) return false;

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
                return false;

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.ModifiedDate = DateTime.Now;

            var updated = await _adminRepository.UpdateAdminAsync(user);
            return updated != null;
        }
    }
}
