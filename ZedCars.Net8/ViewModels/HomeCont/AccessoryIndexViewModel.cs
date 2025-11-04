using Microsoft.AspNetCore.Mvc.Rendering;
using ZedCars.Net8.Models;

namespace ZedCars.Net8.ViewModels.HomeCont
{
    public class AccessoryIndexViewModel
    {
        public List<Accessory> Accessories { get; set; } = new();
        public SelectList Categories { get; set; } = new(new List<string>());
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalAccessories { get; set; }
        public string? SelectedCategory { get; set; }
    }
}
