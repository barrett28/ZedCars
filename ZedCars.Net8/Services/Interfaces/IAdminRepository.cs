using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services
{
    public interface IAdminRepository
    {
        Task<List<Admin>> GetAllAdminsAsync();
        Task<int> GetAllUserAsync();
        Task<int> GetActiveUserAsync();
        Task<Admin?> GetAdminByIdAsync(int adminId);
        Task<Admin> CreateAdminAsync(Admin admin);
        Task<Admin?> UpdateAdminAsync(Admin updateAdmin);
        Task<bool> DeleteAdminAsync(int adminId);
        Task<bool> HasPermissionAsync(int adminId, string permission);
        Admin? ValidateAdmin(string username, string password);
        Task<Admin?> ValidateAdminAsync(string username, string password);
    }
}