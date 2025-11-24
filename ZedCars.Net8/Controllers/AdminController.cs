using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services;
using ZedCars.Net8.Services.Interfaces;

namespace ZedCars.Net8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "SuperAdmin,Manager")]
    public class AdminController : ControllerBase
    {
        private readonly ICarRepository _carRepository;
        private readonly IAdminRepository _adminRepository;
        private readonly IPurchaseRepository _purchaseRepository;
        private readonly ITestDriveRepository _testDriveRepository;
        private readonly IUserActivityRepository _userActivityRepository;
        private readonly IAccessoryRepository _accessoryRepository;

        public AdminController(ICarRepository carRepository, IAdminRepository adminRepository, IPurchaseRepository purchaseRepository, ITestDriveRepository testDriveRepository, IUserActivityRepository userActivityRepository, IAccessoryRepository accessoryRepository)
        {
            _carRepository = carRepository;
            _adminRepository = adminRepository;
            _purchaseRepository = purchaseRepository;
            _testDriveRepository = testDriveRepository;
            _userActivityRepository = userActivityRepository;
            _accessoryRepository = accessoryRepository;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var salesByBrand = await _purchaseRepository.GetSalesByBrandAsync();
            var topBrand = salesByBrand.OrderByDescending(a => a.UnitsSold).FirstOrDefault();

            var dashboardData = new
            {
                ActiveVehicles = await _carRepository.GetActiveCarsAsync(),
                TotalCars = await _carRepository.GetTotalCarsAsync(),
                VehiclePrice = await _carRepository.GetPriceAsync(),
                ActiveUsers = await _adminRepository.GetActiveUserAsync(),
                TotalUsers = await _adminRepository.GetAllUserAsync(),
                AccessoriesTotal = await _accessoryRepository.GetTotalAccessoryValueAsync(),
                AccessoriesSales = await _purchaseRepository.GetAccessorySalesAsync(),
                AverageSale = await _purchaseRepository.GetAverageSalesAsync(),
                RecentInventory = (await _carRepository.GetAllCarsAsync()).Take(5).ToList(),
                UnitsSold = await _purchaseRepository.GetUnitsSoldAsync(),
                TotalSales = await _purchaseRepository.GetTotalSalesAsync(),
                RecentActivities = await GetRecentActivitiesAsync(),
                TopBrandName = topBrand?.Brand ?? string.Empty,
                TopBrandSalesPercent = salesByBrand.Sum(s => s.UnitsSold) > 0
                    ? ((topBrand?.UnitsSold ?? 0) * 100) / salesByBrand.Sum(s => s.UnitsSold)
                    : 0,
                RecentBookings = (await _testDriveRepository.GetAllTestDrivesAsync()).Take(5).ToList(),
                stockData = salesByBrand.Select(s => new {
                    Brand = s.Brand,
                    StockAvailable = s.StockAvailable, UnitsSold = s.UnitsSold,
                }).ToList()
            };

            return Ok(dashboardData);
        }

        [HttpGet("test-stock")]
        public async Task<IActionResult> TestStock()
        {
            var salesByBrand = await _purchaseRepository.GetSalesByBrandAsync();
            return Ok(new { 
                message = "Stock data test",
                count = salesByBrand.Count,
                data = salesByBrand
            });
        }        
        
        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventory([FromQuery] string? brand, [FromQuery] int page = 1)
        {
            const int pageSize = 7;
            var (cars, totalCars) = await _carRepository.GetFilteredCarsAsync(brand, null, null, page, pageSize);
            var brands = await _carRepository.GetDistinctBrandsAsync();

            var inventoryData = new
            {
                Cars = cars,
                Brands = brands,
                SelectedBrand = brand,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling((double)totalCars / pageSize),
                TotalCars = totalCars,
                PageSize = pageSize
            };

            return Ok(inventoryData);
        }

        [HttpGet("vehicles/{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null)
                return NotFound();
            
            return Ok(car);
        }

        [HttpPost("vehicles")]
        public async Task<IActionResult> CreateVehicle([FromBody] Car car)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                car.CreatedBy = User.Identity?.Name ?? "SuperAdmin";
                car.ModifiedBy = User.Identity?.Name ?? "SuperAdmin";

                await _carRepository.AddCarAsync(car);
                return CreatedAtAction(nameof(GetVehicle), new { id = car.CarId }, car);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error adding vehicle: {ex.Message}" });
            }
        }

        [HttpPut("vehicles/{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] Car car)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                car.CarId = id;
                car.ModifiedBy = User.Identity?.Name ?? "Admin";
                var updatedCar = await _carRepository.UpdateCarAsync(car);
                
                if (updatedCar == null)
                    return NotFound();

                return Ok(updatedCar);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating vehicle: {ex.Message}" });
            }
        }

        [HttpDelete("vehicles/{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            try
            {
                var car = await _carRepository.GetCarByIdAsync(id);
                if (car == null)
                    return NotFound();

                var success = await _carRepository.DeleteCarAsync(id, User.Identity?.Name ?? "System");
                if (!success)
                    return BadRequest(new { message = "Failed to delete vehicle" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error deleting vehicle: {ex.Message}" });
            }
        }

        [HttpGet("users")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetUsers([FromQuery] string? searchTerm, [FromQuery] string? role, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var (users, totalCount) = await _adminRepository.GetFilteredAdminsAsync(searchTerm, role, page, pageSize);
            var result = new
            {
                Users = users,
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
            return Ok(result);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var admin = await _adminRepository.GetAdminByIdAsync(id);
            if (admin == null) 
                return NotFound();
            
            return Ok(admin);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] Admin admin)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage);

                    return BadRequest(new
                    {
                        message = "Validation failed",
                        errors = errors
                    });
                }

                await _adminRepository.CreateAdminAsync(admin);

                return CreatedAtAction(
                    nameof(GetUser),
                    new { id = admin.AdminId },
                    admin
                );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = $"Error creating user: {ex.Message}",
                    innerException = ex.InnerException?.Message
                });
            }
        }


        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] Admin admin)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (id <= 0)
                    return BadRequest(new { message = "Invalid Admin ID" });

                admin.AdminId = id;
                var result = await _adminRepository.UpdateAdminAsync(admin);
                if (result == null)
                    return NotFound();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating user: {ex.Message}" });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var admin = await _adminRepository.GetAdminByIdAsync(id);
                if (admin == null)
                    return NotFound();

                await _adminRepository.DeleteAdminAsync(id);
                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error deleting user: {ex.Message}" });
            }
        }

        [HttpGet("sales-data")]
        public async Task<IActionResult> GetSalesData([FromQuery] string period = "month")
        {
            try
            {
                var salesByBrand = await _purchaseRepository.GetSalesByBrandAsync();
                var monthlySales = await _purchaseRepository.GetMonthlySalesTrendAsync(GetMonthsForPeriod(period));

                var totalInventoryValue = await _carRepository.GetPriceAsync();
                var totalSales = await _purchaseRepository.GetTotalSalesAsync();
                var inventoryTurnover = totalInventoryValue > 0 ? (int)(totalSales / totalInventoryValue * 365) : 0;

                var result = new
                {
                    SalesByBrand = salesByBrand.Take(6).Select(s => new {
                        Brand = s.Brand,
                        UnitsSold = s.UnitsSold,
                        TotalSales = s.TotalSales
                    }),
                    MonthlySales = monthlySales.Select(m => new {
                        Month = $"{m.Year}-{m.Month:D2}",
                        UnitsSold = m.UnitsSold,
                        TotalSales = m.TotalSales
                    }),
                    InventoryTurnover = inventoryTurnover,
                    AverageSale = await _purchaseRepository.GetAverageSalesAsync()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("stock-data")]
        public async Task<IActionResult> GetStockData([FromQuery] string period = "month")
        {
            try
            {
                var cars = await _carRepository.GetAllCarsAsync();
                var purchases = await _purchaseRepository.GetAllPurchasesAsync();

                var stockData = cars.GroupBy(c => c.Brand)
                    .Select(g => new {
                        Brand = g.Key,
                        StockAvailable = g.Sum(c => c.StockQuantity),
                        UnitsSold = purchases
                            .Where(p => p.Car != null && p.Car.Brand == g.Key)
                            .Sum(p => p.PurchaseQuantity)
                    })
                    .OrderByDescending(x => x.StockAvailable + x.UnitsSold)
                    .Take(8)
                    .ToList();

                var totalInventoryValue = await _carRepository.GetPriceAsync();
                var totalSales = await _purchaseRepository.GetTotalSalesAsync();
                var inventoryTurnover = totalInventoryValue > 0 ? (int)(totalSales / totalInventoryValue * 365) : 0;

                var result = new
                {
                    StockData = stockData,
                    InventoryTurnover = inventoryTurnover,
                    AverageSale = await _purchaseRepository.GetAverageSalesAsync()
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("testdrives")]
        public async Task<IActionResult> GetAllTestDrives()
        {
            try
            {
                var testDrives = await _testDriveRepository.GetAllTestDrivesAsync();
                return Ok(testDrives);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error fetching test drives: {ex.Message}" });
            }
        }



        [HttpPost("testdrives/{testDriveId}/status")]
        public async Task<IActionResult> UpdateTestDriveStatus(int testDriveId, [FromBody] string status)
        {
            try
            {
                await _testDriveRepository.UpdateTestDriveStatusAsync(testDriveId, status);
                return Ok(new { message = "Test drive status updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error updating status: {ex.Message}" });
            }
        }

        [HttpGet("activities")]
        public async Task<IActionResult> GetActivities()
        {
            var activities = await GetRecentActivitiesAsync();
            return Ok(activities);
        }
        [HttpGet("user-activities")]
        public async Task<IActionResult> GetAllUserActivities()
        {
            var activities = await _userActivityRepository.GetActivitiesAsync(1, 100);
            return Ok(activities);
        }
        private int GetMonthsForPeriod(string period)
        {
            return period switch
            {
                "week" => 1,
                "month" => 3,
                "quarter" => 6,
                "year" => 12,
                _ => 3
            };
        }
        private async Task<List<UserActivity>> GetRecentActivitiesAsync()
        {
            return await _userActivityRepository.GetLatestActivityPerCategoryAsync();
        }
    }
}
