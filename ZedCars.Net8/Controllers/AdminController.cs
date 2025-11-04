using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.Services;
using ZedCars.Net8.ViewModels.AdminCont;

namespace ZedCars.Net8.Controllers
{
    [Authorize(Roles = "SuperAdmin,Manager")]
    public class AdminController : Controller
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

        public async Task<IActionResult> Dashboard()
        {
            var salesByBrand = await _purchaseRepository.GetSalesByBrandAsync();
            var topBrand = salesByBrand.OrderByDescending(a => a.UnitsSold).FirstOrDefault();

            var vm = new AdminDashboardViewModel
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
                RecentBookings = (await _testDriveRepository.GetAllTestDrivesAsync()).Take(5).ToList()
            };
            return View(vm);
        }
        
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> Inventory(string brand, int page = 1)
        {
            const int pageSize = 7;
            var (cars, totalCars) = await _carRepository.GetFilteredCarsAsync(brand, null, null, page, pageSize);
            var brands = await _carRepository.GetDistinctBrandsAsync();

            var vm = new InventoryViewModel
            {
                Cars = cars,
                Brands = brands,
                SelectedBrand = brand,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling((double)totalCars / pageSize),
                TotalCars = totalCars,
                PageSize = pageSize
            };

            return View(vm);
        }

        public IActionResult AddVehicle()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddVehicle(Car car)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    car.CreatedBy = User.Identity?.Name ?? "SuperAdmin";
                    car.ModifiedBy = User.Identity?.Name ?? "SuperAdmin";

                    await _carRepository.AddCarAsync(car);

                    TempData["SuccessMessage"] = $"Vehicle {car.Brand} {car.Model} added successfully!";
                    return RedirectToAction("Inventory");
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Error adding vehicle: {ex.Message}";
            }

            return View(car);
        }

        public async Task<IActionResult> EditVehicle(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null)
            {
                return NotFound();
            }
            return View(car);
        }

        [HttpPost]
        public async Task<IActionResult> EditVehicle(Car car)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    car.ModifiedBy = User.Identity?.Name ?? "Admin";
                    var updatedCar = await _carRepository.UpdateCarAsync(car);
                    
                    if (updatedCar != null)
                    {
                        TempData["SuccessMessage"] = $"Vehicle {car.Brand} {car.Model} updated successfully!";
                        return RedirectToAction("Inventory");
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Error updating vehicle: {ex.Message}";
            }

            return View(car);
        }

        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null)
            {
                return NotFound();
            }
            return View(car);
        }

        [HttpPost, ActionName("DeleteVehicle")]
        public async Task<IActionResult> DeleteVehicleConfirmed(int id)
        {
            try
            {
                var car = await _carRepository.GetCarByIdAsync(id);
                if (car != null)
                {
                    var success = await _carRepository.DeleteCarAsync(id, User.Identity?.Name);
                    if (success)
                    {
                        TempData["SuccessMessage"] = $"Vehicle {car.Brand} {car.Model} deleted successfully!";
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Error deleting vehicle: {ex.Message}";
            }

            return RedirectToAction("Inventory");
        }

        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> ManageUsers()
        {
            var users = await _adminRepository.GetAllAdminsAsync();
            return View(users);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(Admin admin)
        {
            if (ModelState.IsValid)
            {
                await _adminRepository.CreateAdminAsync(admin);
                return RedirectToAction("ManageUsers");
            }
            return View(admin);
        }

        public async Task<IActionResult> Edit(int id)
        {
            var admin = await _adminRepository.GetAdminByIdAsync(id);
            if (admin == null) return NotFound();
            return View(admin);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Admin admin)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    TempData["ErrorMessage"] = "Model validation failed: " + string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                    return View(admin);
                }

                if (admin.AdminId <= 0)
                {
                    TempData["ErrorMessage"] = "Invalid Admin ID";
                    return View(admin);
                }

                var result = await _adminRepository.UpdateAdminAsync(admin);
                if (result != null)
                {
                    TempData["SuccessMessage"] = "User updated successfully!";
                    return RedirectToAction("ManageUsers");
                }
                else
                {
                    TempData["ErrorMessage"] = "User not found or update failed.";
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = $"Error updating user: {ex.Message}";
            }

            return View(admin);
        }

        public async Task<IActionResult> Details(int id)
        {
            var admin = await _adminRepository.GetAdminByIdAsync(id);
            if (admin == null) return NotFound();
            return View(admin);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var admin = await _adminRepository.GetAdminByIdAsync(id);
            if (admin == null) return NotFound();
            return View(admin);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _adminRepository.DeleteAdminAsync(id);
            return RedirectToAction("ManageUsers");
        }

        [HttpGet]
        public async Task<IActionResult> GetSalesData(string period = "month")
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
                    salesByBrand = salesByBrand.Take(6).Select(s => new {
                        brand = s.Brand,
                        unitsSold = s.UnitsSold,
                        totalSales = s.TotalSales
                    }),
                    monthlySales = monthlySales.Select(m => new {
                        month = $"{m.Year}-{m.Month:D2}",
                        unitsSold = m.UnitsSold,
                        totalSales = m.TotalSales
                    }),
                    inventoryTurnover = inventoryTurnover,
                    averageSale = await _purchaseRepository.GetAverageSalesAsync()
                };

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetStockVsSoldData(string period = "month")
        {
            try
            {
                var cars = await _carRepository.GetAllCarsAsync();
                var purchases = await _purchaseRepository.GetAllPurchasesAsync();

                var stockData = cars.GroupBy(c => c.Brand)
                    .Select(g => new {
                        brand = g.Key,
                        stockAvailable = g.Sum(c => c.StockQuantity),
                        unitsSold = purchases
                            .Where(p => p.Car != null && p.Car.Brand == g.Key)
                            .Sum(p => p.PurchaseQuantity)
                    })
                    .OrderByDescending(x => x.stockAvailable + x.unitsSold)
                    .Take(8)
                    .ToList();

                var totalInventoryValue = await _carRepository.GetPriceAsync();
                var totalSales = await _purchaseRepository.GetTotalSalesAsync();
                var inventoryTurnover = totalInventoryValue > 0 ? (int)(totalSales / totalInventoryValue * 365) : 0;

                var result = new
                {
                    stockData = stockData,
                    inventoryTurnover = inventoryTurnover,
                    averageSale = await _purchaseRepository.GetAverageSalesAsync()
                };

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
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

        [Authorize(Roles = "SuperAdmin,Manager")]
        public IActionResult Reports()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateTestDriveStatus(int testDriveId, string status)
        {
            await _testDriveRepository.UpdateTestDriveStatusAsync(testDriveId, status);
            return RedirectToAction("Dashboard");
        }

        private async Task<List<UserActivity>> GetRecentActivitiesAsync()
        {
            return await _userActivityRepository.GetActivitiesAsync(1, 10);
        }

        public async Task<IActionResult> UserActivity()
        {
            var model = new AdminDashboardViewModel
            {
                RecentActivities = await GetRecentActivitiesAsync()
            };
            return View(model);
        }
    }
}
