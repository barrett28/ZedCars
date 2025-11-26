using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.ViewModels.HomeCont;

namespace ZedCars.Net8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class HomeController : ControllerBase
    {
        private readonly ICarRepository _carRepository;
        private readonly IPurchaseRepository _purchaseRepository;
        private readonly ITestDriveRepository _testDriveRepository;
        private readonly IUserActivityRepository _userActivityRepository;
        private readonly IAccessoryRepository _accessoryRepository;
        private readonly ILogger<HomeController> _logger;
        private readonly PdfReceiptService _pdfReceiptService;

        public HomeController(ICarRepository carRepository, IPurchaseRepository purchaseRepository, ITestDriveRepository testDriveRepository, ILogger<HomeController> logger, IUserActivityRepository userActivityRepository, IAccessoryRepository accessoryRepository, PdfReceiptService pdfReceiptService)
        {
            _carRepository = carRepository;
            _purchaseRepository = purchaseRepository;
            _testDriveRepository = testDriveRepository;
            _logger = logger;
            _userActivityRepository = userActivityRepository;
            _accessoryRepository = accessoryRepository;
            _pdfReceiptService = pdfReceiptService;
        }

        [HttpGet("index")]
        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {
            var vm = new HomeIndexViewModel
            {
                CurrentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                VehicleCount = await _carRepository.GetActiveCarsAsync(),
                FeaturedCars = await _carRepository.GetRandomCarsAsync(3)
            };
            return Ok(vm);
        }

        [HttpGet("about")]
        [AllowAnonymous]
        public IActionResult About()
        {
            return Ok(new { message = "About ZedCars" });
        }

        [HttpGet("contact")]
        [AllowAnonymous]
        public IActionResult Contact()
        {
            return Ok(new { message = "Contact Us" });
        }

        [HttpGet("inventory")]
        [Authorize(Roles = "SuperAdmin,Customer,Manager")]
        public async Task<IActionResult> Inventory(string? brand, string? priceRange, string? fuelType, int page = 1, int pageSize = 10)
        {
            var (cars, totalCars) = await _carRepository.GetFilteredCarsAsync(brand, priceRange, fuelType, page, pageSize);
            var brands = await _carRepository.GetDistinctBrandsAsync();
            var fuelTypes = await _carRepository.GetDistinctFuelTypesAsync();

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
            
            return Ok(vm);
        }

        [HttpGet("vehicle/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> VehicleDetail(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null)
            {
                return NotFound();
            }
            return Ok(car);
        }

        [HttpGet("accessories")]
        [AllowAnonymous]
        public async Task<IActionResult> PurchaseAccessory()
        {
            var accessories = await _accessoryRepository.GetActiveAccessoriesAsync();

            var viewModel = new PurchaseAccessoryViewModel
            {
                Accessories = accessories
            };

            return Ok(viewModel);
        }

        [HttpPost("accessories")]
        public async Task<IActionResult> PurchaseAccessory(PurchaseAccessoryViewModel model)
        {
            if (string.IsNullOrEmpty(model.BuyerName) || string.IsNullOrEmpty(model.BuyerEmail))
            {
                return BadRequest(new { message = "Please fill in all required fields." });
            }

            if (model.SelectedAccessories == null || !model.SelectedAccessories.Any())
            {
                return BadRequest(new { message = "Please select at least one accessory." });
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

            await _userActivityRepository.LogActivityAsync(model.BuyerName, "Accessory Purchase",
                $"Purchased accessories for ${selectAccessoryPrices:N0}", Request.Headers["User-Agent"]);
            
            return Ok(new { message = "Accessories purchased successfully!" });
        }

        [HttpGet("direct")]
        [AllowAnonymous]
        public IActionResult Direct()
        {
            return Ok(new { 
                message = "Direct View Test",
                currentTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            });
        }

        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult Test()
        {
            return Ok(new { message = "Home controller is working!", time = DateTime.Now });
        }

        [HttpGet("status")]
        [AllowAnonymous]
        public IActionResult Status()
        {
            return Ok(new 
            { 
                Status = "OK", 
                Controller = "Home", 
                Time = DateTime.Now.ToString() 
            });
        }

        [HttpGet("jwt-test")]
        [AllowAnonymous]
        public IActionResult JwtTest()
        {
            return Ok(new { message = "JWT Test endpoint" });
        }

        [HttpGet("purchases")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> MyPurchases([FromQuery] int page = 1, [FromQuery] int limit = 5)
        {
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized();
            }

            var cars = await _purchaseRepository.GetCarsPurchasedByCustomerAsync(userEmail);
            var models = new List<MyPurchaseViewModel>();

            models.AddRange(cars.Select(car => new MyPurchaseViewModel
            {
                Car = car,
                Purchase = _purchaseRepository.GetPurchaseByCarAndEmailAsync(car.CarId ?? 0, userEmail).Result,
                TestDrive = _testDriveRepository.GetTestDriveByCarAndEmailAsync(car.CarId ?? 0, userEmail).Result
            }));

            var accessoryPurchases = await _accessoryRepository.GetAccessoryPurchasesByEmailAsync(userEmail);

            models.AddRange(accessoryPurchases.Select(ap => new MyPurchaseViewModel
            {
                AccessoryPurchaseOnly = ap
            }));

            var orderedModels = models.OrderByDescending(m =>m.Purchase?.PurchaseDate ?? m.AccessoryPurchaseOnly?.PurchaseDate ?? DateTime.MinValue).ToList();
            
            var totalCount = orderedModels.Count;
                        var totalPages = (int)Math.Ceiling((double)totalCount / limit);
                        var paginatedModels = orderedModels.Skip((page - 1) * limit).Take(limit).ToList();
            return Ok(new
            {
                                purchases = paginatedModels,
                currentPage = page,
                totalPages = totalPages,
                total = totalCount
            });
        }


        [HttpGet("downloadReceipt/{purchaseId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> DownloadReceipt(int purchaseId)
        {
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized();
            }

            var purchase = await _purchaseRepository.GetPurchaseByIdAsync(purchaseId);

            if (purchase == null || purchase.BuyerEmail != userEmail)
            {
                return NotFound(new { message = "Purchase not found" });
            }

            var pdfBytes = _pdfReceiptService.GeneratePurchaseReceipt(purchase);

            return File(
                pdfBytes,
                "application/pdf",
                $"Receipt_{purchaseId}_{DateTime.Now:yyyyMMdd}.pdf"
            );
        }


        [HttpGet("purchase/{id}")]
        public async Task<IActionResult> Purchase(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if (car == null) return NotFound();
            
            var accessories = await _accessoryRepository.GetActiveAccessoriesAsync();

            var viewModel = new PurchaseViewModel
            {
                Purchase = new Purchase { CarId = car.CarId ?? 0, Car = car },
                Accessories = accessories
            };
            return Ok(viewModel);
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> Purchase([FromBody] Purchase purchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var car = await _carRepository.GetCarByIdAsync(purchase.CarId);
            if (car == null)
            {
                return NotFound();
            }

            purchase.Car = car;
            decimal totalPrice = car.Price * purchase.PurchaseQuantity;

            if (purchase.SelectedAccessories != null && purchase.SelectedAccessories.Any())
            {
                var accessoryPrices = await _accessoryRepository.GetAccessoryPricesByNamesAsync(purchase.SelectedAccessories);
                totalPrice += accessoryPrices;
            }

            purchase.PurchasePrice = totalPrice;

            await _purchaseRepository.AddPurchaseWithAccessoriesAsync(purchase, purchase.SelectedAccessories ?? new List<string>());

            await _userActivityRepository.LogActivityAsync
                (purchase.BuyerName, "Purchase", $"Purchased {car.Brand} {car.Model} for ${totalPrice:N0}", Request.Headers["User-Agent"]);

            return Ok(new { message = "Purchase completed successfully!" });
        }

        [HttpGet("testdrives")]
        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> MyTestDrives()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                if (!string.IsNullOrEmpty(userEmail))
                {
                    var userTestDrives = await _testDriveRepository.GetTestDrivesByCustomerAsync(userEmail);
                    return Ok(userTestDrives);
                }               
                return Unauthorized();
            }

            var testDrives = await _testDriveRepository.GetTestDrivesByUserIdAsync(userId);
            return Ok(testDrives);
        }

        [HttpPost("book-testdrive")]
        public async Task<IActionResult> BookTestDrive(TestDrive testDrive)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please fill all required fields.");
            }

            var isAvailable = await _testDriveRepository.IsSlotAvailableForCarAsync(testDrive.CarId, testDrive.BookingDate, testDrive.TimeSlot);
            if (!isAvailable)
            {
                return BadRequest("Selected time slot is not available for this vehicle.");
            }

            await _testDriveRepository.AddTestDriveAsync(testDrive);
            
            var car = await _carRepository.GetCarByIdAsync(testDrive.CarId);
            
            await _userActivityRepository.LogActivityAsync(
                testDrive.CustomerName,
                "Test Drive Booked",
                $"Booked test drive for {car?.Brand} {car?.Model}",
                Request.Headers["User-Agent"]
            );

            return Ok(new { message = "Test drive booked successfully!" });
        }

        [HttpGet("testdrive/{id}")]
        public async Task<IActionResult> TestDrive(int id)
        {
            var car = await _carRepository.GetCarByIdAsync(id);
            if(car == null) return NotFound();

            var testDrive = new TestDrive()
            {
                CarId = car.CarId ?? 0,
                Car = car
            };
            return Ok(testDrive);
        }

        [HttpGet("available-slots/{carId}")]
        public async Task<IActionResult> GetAvailableSlots(int carId, [FromQuery] string date)
        {
            if (!DateTime.TryParse(date, out DateTime bookingDate))
            {
                return BadRequest("Invalid date format");
            }

            var allSlots = new[] { "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM" };
            var availableSlots = new List<string>();

            foreach (var slot in allSlots)
            {
                var isAvailable = await _testDriveRepository.IsSlotAvailableForCarAsync(carId, bookingDate, slot);
                if (isAvailable)
                {
                    availableSlots.Add(slot);
                }
            }

            return Ok(availableSlots);
        }

        [HttpPost("testdrive")]
        public async Task<IActionResult> TestDrive(TestDrive testDrive)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var isAvailable = await _testDriveRepository.IsSlotAvailableAsync(testDrive.BookingDate, testDrive.TimeSlot);
            if (!isAvailable)
            {
                return BadRequest("Selected time slot is not available.");
            }
            
            await _testDriveRepository.AddTestDriveAsync(testDrive);
            return Ok(new { message = "Test drive booked successfully!" });
        }
}
}
