using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using ZedCars.Net8.Models;
using ZedCars.Net8.ViewModels.HomeCont;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.Services;

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

        public HomeController(ICarRepository carRepository, IPurchaseRepository purchaseRepository, ITestDriveRepository testDriveRepository, ILogger<HomeController> logger, IUserActivityRepository userActivityRepository, IAccessoryRepository accessoryRepository)
        {
            _carRepository = carRepository;
            _purchaseRepository = purchaseRepository;
            _testDriveRepository = testDriveRepository;
            _logger = logger;
            _userActivityRepository = userActivityRepository;
            _accessoryRepository = accessoryRepository;
        }

        [HttpGet("")]
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
        public async Task<IActionResult> Inventory(string? brand, string? priceRange, string? fuelType, int page = 1)
        {
            const int pageSize = 6;
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
        public async Task<IActionResult> MyPurchases()
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
                Purchase = _purchaseRepository.GetPurchaseByCarAndEmailAsync(car.CarId.Value, userEmail).Result,
                TestDrive = _testDriveRepository.GetTestDriveByCarAndEmailAsync(car.CarId.Value, userEmail).Result
            }));

            var accessoryPurchases = await _accessoryRepository.GetAccessoryPurchasesByEmailAsync(userEmail);

            models.AddRange(accessoryPurchases.Select(ap => new MyPurchaseViewModel
            {
                AccessoryPurchaseOnly = ap
            }));

            return Ok(models.OrderByDescending(m => 
                m.Purchase?.PurchaseDate ?? m.AccessoryPurchaseOnly?.PurchaseDate ?? DateTime.MinValue).ToList());
        }

        [HttpGet("purchase/{id}")]
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

            await _purchaseRepository.AddPurchaseWithAccessoriesAsync(purchase, purchase.SelectedAccessories);

            await _userActivityRepository.LogActivityAsync
                (purchase.BuyerName, "Purchase", $"Purchased {car.Brand} {car.Model} for ${totalPrice:N0}", Request.Headers["User-Agent"]);

            return Ok(new { message = "Purchase completed successfully!" });
        }

        [HttpGet("testdrives")]
        [Authorize(Roles ="Customer")]
        public async Task<IActionResult> MyTestDrives()
        {
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized();
            }

            var testDrives = await _testDriveRepository.GetTestDrivesByCustomerAsync(userEmail);
            return Ok(testDrives);
        }

        [HttpPost("book-testdrive")]
        public async Task<IActionResult> BookTestDrive(TestDrive testDrive)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please fill all required fields.");
            }

            var isAvailable = await _testDriveRepository.IsSlotAvailableAsync(testDrive.BookingDate, testDrive.TimeSlot);
            if (!isAvailable)
            {
                return BadRequest("Selected time slot is not available.");
            }

            await _testDriveRepository.AddTestDriveAsync(testDrive);
            
            var car = await _carRepository.GetCarByIdAsync(testDrive.CarId);
            
            await _userActivityRepository.LogActivityAsync(
                testDrive.CustomerName,
                "Test Drive Booked",
                $"Booked test drive for {car.Brand} {car.Model}",
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
                CarId = car.CarId.Value,
                Car = car
            };
            return Ok(testDrive);
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
