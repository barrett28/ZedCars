using Microsoft.AspNetCore.Mvc;
using ZedCars.Net8.Services.Interfaces;
using ZedCars.Net8.ViewModels.HomeCont;

namespace ZedCars.Net8.Controllers
{
    public class WebController : Controller
    {
        private readonly ICarRepository _carRepository;

        public WebController(ICarRepository carRepository)
        {
            _carRepository = carRepository;
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
    }
}
