using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services
{
    public interface ITestDriveRepository
    {
        Task AddTestDriveAsync(TestDrive testDrive);
        Task<List<TestDrive>> GetAllTestDrivesAsync();
        Task UpdateTestDriveStatusAsync(int testDriveId, string status);
        Task<bool> IsSlotAvailableAsync(DateTime date, string timeSlot);
        Task<TestDrive?> GetTestDriveByIdAsync(int id);
        Task<List<TestDrive>> GetTestDrivesByCustomerAsync(string customerEmail);
        Task<List<TestDrive>> GetTestDrivesByUserIdAsync(int userId);
        Task<TestDrive?> GetTestDriveByCarAndEmailAsync(int carId, string email);
    }
}
