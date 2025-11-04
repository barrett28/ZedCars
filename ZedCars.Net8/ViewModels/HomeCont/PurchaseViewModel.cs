using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.HomeCont
{
    public class PurchaseViewModel
    {
        public Purchase Purchase { get; set; } = new();
        public List<Accessory> Accessories { get; set; } = new();
    }
}
