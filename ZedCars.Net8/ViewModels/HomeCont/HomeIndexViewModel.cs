using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.HomeCont
{
    public class HomeIndexViewModel
    {
        public string Message { get; set; } = "Welcome to ZedCars!";
        public string CurrentTime { get; set; } = string.Empty;
        public int VehicleCount { get; set; }
        public List<Car> FeaturedCars { get; set; } = new();

    }
}
