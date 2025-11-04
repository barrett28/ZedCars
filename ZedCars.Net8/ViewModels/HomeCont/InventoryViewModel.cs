using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.HomeCont
{
    public class InventoryViewModel
    {
        public List<Car> Cars { get; set; } = new();
        public List<string> Brands { get; set; } = new();
        public List<string> FuelTypes { get; set; } = new();

        // Selected filters
        public string? SelectedBrand { get; set; }
        public string? SelectedFuelType { get; set; }
        public string? SelectedPriceRange { get; set; }

        // Paging
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalCars { get; set; }
    }
}
