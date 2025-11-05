namespace ZedCars.Net8.Models
{
    public class PurchaseRequest
    {
        public Purchase Purchase { get; set; } = new();
        public List<string>? SelectedAccessories { get; set; }
    }
}
