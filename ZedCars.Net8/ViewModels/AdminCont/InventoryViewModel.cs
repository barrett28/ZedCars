using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.AdminCont
{
    public class InventoryViewModel
    {
        public List<Car> Cars { get; set; } = new();
        public List<string> Brands { get; set; } = new();
        public string SelectedBrand { get; set; } = string.Empty;
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCars { get; set; }
        public int PageSize { get; set; }
    }
}
