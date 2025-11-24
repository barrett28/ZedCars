using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ZedCarsContext _context;
        private readonly IPasswordHasher<Admin> _passwordHasher;

        public AdminRepository(ZedCarsContext context, IPasswordHasher<Admin> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        // Get all admins
        public async Task<List<Admin>> GetAllAdminsAsync()
        {
            return await _context.Admins.OrderBy(a => a.AdminId).ToListAsync();
        }

        // Get total number of users (Active/ Inactive)
        public async Task<int> GetAllUserAsync()
        {
            return await _context.Admins.CountAsync();
        }

        // Get active admins
        public async Task<int> GetActiveUserAsync()
        {
            return await _context.Admins.CountAsync(c=> c.IsActive);
        }

        // Get a single admin by Id
        public async Task<Admin?> GetAdminByIdAsync(int adminId)
        {
            return await _context.Admins.FirstOrDefaultAsync(a => a.AdminId == adminId);
        }

        // Create new admin with hashed password
        public async Task<Admin> CreateAdminAsync(Admin admin)
        {
            admin.Password = _passwordHasher.HashPassword(admin, admin.Password); // Built method from Identity
            admin.CreatedDate = DateTime.UtcNow;
            admin.ModifiedDate = DateTime.UtcNow;
            admin.IsActive = true;

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
            return admin;
        }

        // Update admin details
        public async Task<Admin?> UpdateAdminAsync(Admin updateAdmin)
        {
            try
            {
                var existing = await _context.Admins.FirstOrDefaultAsync(a => a.AdminId == updateAdmin.AdminId);
                if (existing == null) return null;

                existing.FullName = updateAdmin.FullName;
                existing.Username = updateAdmin.Username;
                existing.Email = updateAdmin.Email;
                existing.Department = updateAdmin.Department;
                existing.Role = updateAdmin.Role;
                existing.PhoneNumber = updateAdmin.PhoneNumber;
                existing.Permissions = updateAdmin.Permissions;
                existing.IsActive = updateAdmin.IsActive;
                existing.ModifiedDate = DateTime.UtcNow;

                // Only update password if provided
                if (!string.IsNullOrEmpty(updateAdmin.Password))
                {
                    existing.Password = _passwordHasher.HashPassword(existing, updateAdmin.Password);
                }

                await _context.SaveChangesAsync();
                return existing;
            }
            catch
            {
                return null;
            }
        }

        // Delete (Only Deactivating user role)
        public async Task<bool> DeleteAdminAsync(int adminId)
        {
            var admin = await _context.Admins.FindAsync(adminId);
            if (admin == null) return false;

            admin.IsActive = false;
            admin.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        // Role-based check
        public async Task<bool> HasPermissionAsync(int adminId, string permission)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.AdminId == adminId && a.IsActive);
            if (admin == null || string.IsNullOrEmpty(admin.Permissions)) return false;

            var perms = admin.Permissions.Split(',', StringSplitOptions.TrimEntries);
            return perms.Contains("all") || perms.Contains(permission);
        }

        public Admin? ValidateAdmin(string username, string password)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.Username == username && a.IsActive);
            if (admin == null) return null;

            var result = _passwordHasher.VerifyHashedPassword(admin, admin.Password, password);
            return result == PasswordVerificationResult.Success ? admin : null;
        }

        public async Task<Admin?> ValidateAdminAsync(string username, string password)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == username && a.IsActive);
            if (admin == null) return null;

            // Check if password is hashed (starts with "AQ" for PBKDF2)
            if (admin.Password.StartsWith("AQ"))
            {
                var result = _passwordHasher.VerifyHashedPassword(admin, admin.Password, password);
                return result == PasswordVerificationResult.Success ? admin : null;
            }
            else
            {
                // Plain text password - verify and hash it
                if (admin.Password == password)
                {
                    admin.Password = _passwordHasher.HashPassword(admin, password);
                    await _context.SaveChangesAsync();
                    return admin;
                }
                return null;
            }
        }

        public async Task<List<Admin>> GetFilteredAdminsAsync(string? searchTerm, string? role)
        {
            var query = _context.Admins.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(a => a.Username.Contains(searchTerm) || a.Email.Contains(searchTerm));       
            }
            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(a => a.Role == role);
            }

           return await query.OrderBy(a => a.AdminId).ToListAsync();
        }

        public async Task<(List<Admin> admins, int totalCount)> GetFilteredAdminsAsync(string? searchTerm, string? role, int page, int pageSize)
        {
            var query = _context.Admins.AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(a => a.Username.Contains(searchTerm) || a.Email.Contains(searchTerm));
            }

            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(a => a.Role == role);
            }

            var totalCount = await query.CountAsync();
            var admins = await query.OrderBy(a => a.AdminId)
                                  .Skip((page - 1) * pageSize)
                                  .Take(pageSize)
                                  .ToListAsync();

            return (admins, totalCount);
        }

        private List<Admin> GetHardcodedAdmins()
        {
            return new List<Admin>
            {
                new Admin { AdminId = 1, Username = "admin", Password = "admin123", FullName = "Admin User", Email = "admin@zedcars.com", Role = "SuperAdmin", IsActive = true },
                new Admin { AdminId = 2, Username = "user1", Password = "password1", FullName = "John Smith", Email = "user1@zedcars.com", Role = "Customer", IsActive = true },
                new Admin { AdminId = 3, Username = "user2", Password = "password2", FullName = "Jane Doe", Email = "user2@zedcars.com", Role = "Customer", IsActive = true },
                new Admin { AdminId = 4, Username = "superadmina", Password = "admin123a", FullName = "Super Administrator", Email = "super@zedcars.com", Role = "SuperAdmin", IsActive = true },
                new Admin { AdminId = 5, Username = "admin1", Password = "password123", FullName = "John Smith", Email = "john.smith@zedcars.com", Role = "Manager", IsActive = true }
            };
        }
    }
}
