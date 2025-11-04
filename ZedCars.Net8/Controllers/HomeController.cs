using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ZedCars.Net8.Models;
using ZedCars.Net8.ViewModels.HomeCont;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.Services;

namespace ZedCars.Net8.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICarRepository _carRepository;
        private readonly IPurchaseRepository _purchaseRepository;
        private readonly ITestDriveRepository _testDriveRepository;
        private readonly IUserActivityRepository _userActivityRepository;
        private readonly IAccessoryRepository _accessoryRepository;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ICarRepository carRepository, IPurchaseRepository purchaseRepository, ITestDriveRepository testDriveRepository, ILogger<HomeController> logger, IUserActivityRepository userActivityRepository, IAccessoryRepository accessoryRepository)
        {
            _carRepository = carRepository;
            _purchaseRepository = purchaseRepository;
            _testDriveRepository = testDriveRepository;
            _logger = logger;
            _userActivityRepository = userActivityRepository;
            _accessoryRepository = accessoryRepository;
        }

        public async Task<IActionResult> Index()
        {
            var vm = new HomeIndexViewModel
            {
                CurrentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                VehicleCount = await _carRepository.GetActiveCarsAsync(),
                FeaturedCars = await _carRepository.GetRandomCarsAsync(3)
            };
            return View(vm);
        }

        public IActionResult About()
        {
            ViewBag.Message = "About ZedCars";
            return View();
        }

        public IActionResult Contact()
        {
            ViewBag.Message = "Contact Us";
            return View();
        }

        [Authorize(Roles = "SuperAdmin,Customer,Manager")]
        public async Task<IActionResult> Inventory(string? brand, string? priceRange, string? fuelType, int page = 1)
        {
            const int pageSize = 6;
            var (cars, totalCars) = await _carRepository.GetFilteredCarsAsync(brand, priceRange, fuelType, page, pageSize);
            var brands = await _carRepository.GetDistinctBrandsAsync();
            var fuelTypes = await _carRepository.GetDistinctFuelTypesAsync();

            if (Request.Headers["Accept"].ToString().Contains("application/json"))
            {
                return Json(new
                {
                    success = true,
                    data = cars
                });
            }

            var vm = new InventoryViewModel
            {
                Cars = cars,
                Brands = brands,
                FuelTypes = fuelTypes,
                SelectedBrand = brand,
                SelectedFuelType = fuelType,
                SelectedPriceRange = priceRange,
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCars / pageSize),
                TotalCars = totalCars
            };
            
            if (Request.Headers["Accept"].ToString().Contains("application/json"))
            {
                return Json(new { success = true, data = vm });
            }
            
            return View(vm);
        }

        public async Task<IActionResult> VehicleDetail(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null)
            {
                return NotFound();
            }
            return View(car);
        }

        public async Task<IActionResult> PurchaseAccessory()
        {
            var accessories = await _accessoryRepository.GetActiveAccessoriesAsync();

            var viewModel = new PurchaseAccessoryViewModel
            {
                Accessories = accessories
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PurchaseAccessory(PurchaseAccessoryViewModel model)
        {
            if (string.IsNullOrEmpty(model.BuyerName) || string.IsNullOrEmpty(model.BuyerEmail))
            {
                TempData["ErrorMessage"] = "Please fill in all required fields.";
                return View();
            }

            if (model.SelectedAccessories == null || !model.SelectedAccessories.Any())
            {
                TempData["ErrorMessage"] = "Please select at least one accessory.";
                return View();
            }

            var selectAccessoryPrices = await _accessoryRepository.GetAccessoryPricesByNamesAsync(model.SelectedAccessories);
            
            var accessoryPurchase = new AccessoryPurchaseOnly
            {
                BuyerName = model.BuyerName,
                BuyerEmail = model.BuyerEmail,
                SelectedAccessories = model.SelectedAccessories,
                TotalPrice = selectAccessoryPrices,
                PurchaseDate = DateTime.Now
            };

            await _accessoryRepository.AddAccessoryPurchaseAsync(accessoryPurchase);
            
            TempData["SuccessMessage"] = "Accessories purchased successfully!";

            await _userActivityRepository.LogActivityAsync(model.BuyerName, "Accessory Purchase",
                $"Purchased accessories for ${selectAccessoryPrices:N0}", Request.Headers["User-Agent"]);
            
            return RedirectToAction("Index");
        }

        public IActionResult Direct()
        {
            ViewBag.Message = "Direct View Test";
            ViewBag.CurrentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            return View();
        }

        public IActionResult Test()
        {
            return Content("Home controller is working! Time: " + DateTime.Now);
        }

        public IActionResult Status()
        {
            return Json(new 
            { 
                Status = "OK", 
                Controller = "Home", 
                Time = DateTime.Now.ToString() 
            });
        }

        public IActionResult JwtTest()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        // JWT API Endpoints
        [HttpGet]
        [Route("api/home/inventory")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetInventoryApi(string? brand, string? priceRange, string? fuelType, int page = 1)
        {
            const int pageSize = 6;
            var (cars, totalCars) = await _carRepository.GetFilteredCarsAsync(brand, priceRange, fuelType, page, pageSize);
            
            return Ok(new
            {
                success = true,
                data = new
                {
                    cars,
                    totalCars,
                    currentPage = page,
                    totalPages = (int)Math.Ceiling((double)totalCars / pageSize)
                }
            });
        }

        [HttpGet]
        [Route("api/home/vehicle/{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetVehicleApi(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null)
                return NotFound(new { success = false, message = "Vehicle not found" });

            return Ok(new { success = true, data = car });
        }

        [HttpGet]
        [Route("api/home/purchases")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Customer")]
        public async Task<IActionResult> GetMyPurchasesApi()
        {
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized(new { success = false, message = "User not authenticated" });

            var cars = await _purchaseRepository.GetCarsPurchasedByCustomerAsync(userEmail);
            var purchases = new List<object>();

            foreach (var car in cars)
            {
                var purchase = await _purchaseRepository.GetPurchaseByCarAndEmailAsync(car.CarId.Value, userEmail);
                purchases.Add(new { car, purchase });
            }

            return Ok(new { success = true, data = purchases });
        }

        public async Task<IActionResult> Purchase(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null) return NotFound();
            
            var accessories = await _accessoryRepository.GetActiveAccessoriesAsync();

            var viewModel = new PurchaseViewModel
            {
                Purchase = new Purchase { CarId = car.CarId.Value, Car = car },
                Accessories = accessories
            };
            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Purchase(PurchaseViewModel model, List<string> selectedAccessories)
        {
            if (!ModelState.IsValid)
            {
                model.Purchase.Car = await _carRepository.GetCarByIdAsync(model.Purchase.CarId);
                model.Accessories = await _accessoryRepository.GetActiveAccessoriesAsync();
                return View(model);
            }

            var car = await _carRepository.GetCarByIdAsync(model.Purchase.CarId);
            if (car == null)
            {
                return NotFound();
            }

            model.Purchase.Car = car;
            decimal totalPrice = car.Price * model.Purchase.PurchaseQuantity;

            if (selectedAccessories != null && selectedAccessories.Any())
            {
                var accessoryPrices = await _accessoryRepository.GetAccessoryPricesByNamesAsync(selectedAccessories);
                totalPrice += accessoryPrices;
            }

            model.Purchase.PurchasePrice = totalPrice;

            await _purchaseRepository.AddPurchaseWithAccessoriesAsync(model.Purchase, selectedAccessories);

            await _userActivityRepository.LogActivityAsync
                (model.Purchase.BuyerName, "Purchase", $"Purchased {car.Brand} {car.Model} for ${totalPrice:N0}", Request.Headers["User-Agent"]);

            return RedirectToAction("MyPurchases", "Home");
        }

        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> MyPurchases()
        {
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            
            if (string.IsNullOrEmpty(userEmail))
            {
                return RedirectToAction("Login", "Account");
            }

            var cars = await _purchaseRepository.GetCarsPurchasedByCustomerAsync(userEmail);
            var models = new List<MyPurchaseViewModel>();

            models.AddRange(cars.Select(car => new MyPurchaseViewModel
            {
                Car = car,
                Purchase = _purchaseRepository.GetPurchaseByCarAndEmailAsync(car.CarId.Value, userEmail).Result,
                TestDrive = _testDriveRepository.GetTestDriveByCarAndEmailAsync(car.CarId.Value, userEmail).Result
            }));

            var accessoryPurchases = await _accessoryRepository.GetAccessoryPurchasesByEmailAsync(userEmail);

            models.AddRange(accessoryPurchases.Select(ap => new MyPurchaseViewModel
            {
                AccessoryPurchaseOnly = ap
            }));

            return View(models.OrderByDescending(m => 
                m.Purchase?.PurchaseDate ?? m.AccessoryPurchaseOnly?.PurchaseDate ?? DateTime.MinValue).ToList());
        }

        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> MyTestDrives()
        {
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return RedirectToAction("Login", "Account");
            }

            var testDrives = await _testDriveRepository.GetTestDrivesByCustomerAsync(userEmail);
            return View(testDrives);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BookTestDrive(TestDrive testDrive)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Please fill all required fields.";
                return RedirectToAction("VehicleDetail", new { id = testDrive.CarId });
            }

            var isAvailable = await _testDriveRepository.IsSlotAvailableAsync(testDrive.BookingDate, testDrive.TimeSlot);
            if (!isAvailable)
            {
                TempData["ErrorMessage"] = "Selected time slot is not available.";
                return RedirectToAction("VehicleDetail", new { id = testDrive.CarId });
            }

            await _testDriveRepository.AddTestDriveAsync(testDrive);
            TempData["SuccessMessage"] = "Test drive booked successfully!";
            
            var car = await _carRepository.GetCarByIdAsync(testDrive.CarId);
            
            await _userActivityRepository.LogActivityAsync(
                testDrive.CustomerName,
                "Test Drive Booked",
                $"Booked test drive for {car.Brand} {car.Model}",
                Request.Headers["User-Agent"]
            );

            return RedirectToAction("MyTestDrives");
        }

        public async Task<IActionResult> TestDrive(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if(car == null) return NotFound();

            var testDrive = new TestDrive()
            {
                CarId = car.CarId.Value,
                Car = car
            };
            return View(testDrive);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> TestDrive(TestDrive testDrive)
        {
            if (!ModelState.IsValid)
            {
                testDrive.Car = await _carRepository.GetCarByIdAsync(testDrive.CarId);
                return View(testDrive);
            }

            var isAvailable = await _testDriveRepository.IsSlotAvailableAsync(testDrive.BookingDate, testDrive.TimeSlot);
            if (!isAvailable)
            {
                ModelState.AddModelError("", "Selected time slot is not available.");
                testDrive.Car = await _carRepository.GetCarByIdAsync(testDrive.CarId);
                return View(testDrive);
            }
            
            await _testDriveRepository.AddTestDriveAsync(testDrive);
            return RedirectToAction("VehicleDetail", new { id = testDrive.CarId });
        }
    }
}
