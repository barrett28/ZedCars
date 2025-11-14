using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services
{
    public interface IUserActivityRepository
    {
        Task LogActivityAsync(string username, string activityType, string description, string? userAgent = null, string? status = "Success");
        Task<List<UserActivity>> GetActivitiesAsync(int page = 1, int pageSize = 50);
        Task<List<UserActivity>> GetUserActivitiesAsync(string username);
        Task<List<UserActivity>> GetLatestActivityPerCategoryAsync();
    }
}