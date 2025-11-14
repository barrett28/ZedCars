using ZedCars.Net8.Data;
using ZedCars.Net8.Models;
using Microsoft.EntityFrameworkCore;
namespace ZedCars.Net8.Services
{
    public class UserActivityRepository : IUserActivityRepository
    {
        public readonly ZedCarsContext _context;
        public UserActivityRepository(ZedCarsContext context)
        {
            _context = context;
        }
        public async Task LogActivityAsync(string username, string activityType, string description, string? userAgent = null, string? status = "Success")
        {
            var activity = new UserActivity
            {
                Username = username,
                ActivityType = activityType,
                Description = description,
                UserAgent = userAgent,
                Status = status,
                ActivityDate = DateTime.Now
            };
            _context.UserActivities.Add(activity);
            await _context.SaveChangesAsync();
        }

        public async Task<List<UserActivity>> GetActivitiesAsync(int page = 1, int pageSize = 50)
        {
            return await _context.UserActivities
            .OrderByDescending(a => a.ActivityDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        }
        public async Task<List<UserActivity>> GetUserActivitiesAsync(string username)
        {
            return await _context.UserActivities
            .Where(a => a.Username == username)
            .OrderByDescending(a => a.ActivityDate)
            .ToListAsync();
        }

        public async Task<List<UserActivity>> GetLatestActivityPerCategoryAsync()
        {
            var activityTypes = await _context.UserActivities
                .Select(a => a.ActivityType)
                .Distinct()
                .ToListAsync();

            var result = new List<UserActivity>();
            
            foreach (var type in activityTypes)
            {
                var latestActivity = await _context.UserActivities
                    .Where(a => a.ActivityType == type)
                    .OrderByDescending(a => a.ActivityDate)
                    .FirstOrDefaultAsync();
                    
                if (latestActivity != null)
                {
                    result.Add(latestActivity);
                }
            }
            
            return result.OrderByDescending(a => a.ActivityDate).ToList();
        }

    }
}
