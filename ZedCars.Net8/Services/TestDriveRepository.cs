using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ZedCars.Net8.Services
{
    public class TestDriveRepository : ITestDriveRepository
    {
        private readonly ZedCarsContext _context;
        public TestDriveRepository(ZedCarsContext context) {
            _context = context;
        }
        
        public async Task AddTestDriveAsync(TestDrive testDrive)
        {
            _context.TestDrives.Add(testDrive);
            await _context.SaveChangesAsync();
        }

        public async Task<List<TestDrive>> GetAllTestDrivesAsync()
        {
            return await _context.TestDrives
                .Include(td => td.Car)
                .OrderByDescending(td=>td.BookingDate)
                .ToListAsync();
        }

        public async Task UpdateTestDriveStatusAsync(int testDriveId, string status)
        {
            var testDrive = await _context.TestDrives.FindAsync(testDriveId);

            if (testDrive != null)
            {
                testDrive.Status = status;
                await _context.SaveChangesAsync();
            }
        }
            
        public async Task<bool> IsSlotAvailableAsync(DateTime date,string timeSlot)
        {
            var existingBooking = await _context.TestDrives
                    .FirstOrDefaultAsync(td => td.BookingDate.Date == date.Date
                    && td.TimeSlot == timeSlot
                    && td.Status != "Cancelled");
                return existingBooking == null;
        }        

        public async Task<TestDrive?> GetTestDriveByIdAsync(int id)
        {
            return await _context.TestDrives
                .Include(td => td.Car)
                .FirstOrDefaultAsync(td => td.TestDriveId == id);
        }

        //public async Task<List<Car>> GetCarsPurchasedByCustomerAsync(string buyerEmail)
        //{
        //    var purchases = await _context.Purchases.AsNoTracking()
        //        .Include(p => p.Car)
        //        .Where(p => p.BuyerEmail == buyerEmail)
        //        .ToListAsync();

        //    return purchases
        //        .Where(p => p.Car != null)
        //        .Select(p => p.Car!)
        //        .ToList();
        //}
        public async Task<List<TestDrive>> GetTestDrivesByCustomerAsync(string customerEmail)
        {
            return await _context.TestDrives
                .AsNoTracking()
                .Include(td => td.Car) // Include the related Car if needed
                .Where(td => td.CustomerEmail == customerEmail)
                .OrderByDescending(td => td.CreatedAt)
                .ToListAsync();
        }
        public async Task<List<TestDrive>> GetTestDrivesByUserIdAsync(int userId)
        {
            return await _context.TestDrives
                .AsNoTracking()
                .Include(td => td.Car)
                .Where(td => _context.Admins.Any(a => a.AdminId == userId && a.Email == td.CustomerEmail))
                .OrderByDescending(td => td.CreatedAt)
                .ToListAsync();
        }        
        
        public async Task<TestDrive?> GetTestDriveByCarAndEmailAsync(int carId, string email)
        {
            return await _context.TestDrives
                .FirstOrDefaultAsync(t => t.CarId == carId && t.CustomerEmail == email);
        }

        public async Task<bool> IsSlotAvailableForCarAsync(int carId, DateTime date, string timeSlot)
        {
            var existingBooking = await _context.TestDrives
                    .FirstOrDefaultAsync(td => td.CarId == carId
                    && td.BookingDate.Date == date.Date
                    && td.TimeSlot == timeSlot
                    && td.Status != "Cancelled");
                return existingBooking == null;
        }
    }
}

