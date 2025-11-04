using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.HomeCont
{
    public class PurchaseAccessoryViewModel
    {
        public string BuyerName { get; set; } = string.Empty;
        public string BuyerEmail { get; set; } = string.Empty;

        public List<string> SelectedAccessories { get; set; } = new();

        public List<Accessory> Accessories { get; set; } = new();
    }
}
