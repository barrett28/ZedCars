using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.AdminCont
{
    public class AdminDashboardViewModel
    {
        // For vehicles
        public int ActiveVehicles { get; set; }
        public decimal VehiclePrice { get; set; }
        public int TotalCars { get; set; }
        public List<Car> RecentInventory { get; set; } = new List<Car>();
        
        // For users
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }

        // For Accessories

        public decimal AccessoriesSales { get; set; }
        public decimal? AccessoriesTotal { get; set; }

        // For Sales
        public string TopBrandName { get; set; } = string.Empty;
        public decimal TopBrandSalesPercent { get; set; }
        public decimal TotalSales { get; set; }
        public decimal AverageSale { get; set; }
        public int UnitsSold { get; set; }

        // For Test Drives
        public List<TestDrive> RecentBookings { get; set; } = new List<TestDrive>();
        public List<UserActivity> RecentActivities { get; set; } = new List<UserActivity>();

    }
}