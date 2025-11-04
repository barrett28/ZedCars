using ZedCars.Net8.Models;
using ZedCars.Net8.ViewModels.ReportsCont;

namespace ZedCars.Net8.Services
{
    public interface IPurchaseRepository
    {
        Task<Purchase> AddPurchaseAsync(Purchase purchase);
        Task<Purchase?> GetPurchaseByIdAsync(int id);
        Task<List<Purchase>> GetAllPurchasesAsync();
        Task<List<SalesByBrandDto>> GetSalesByBrandAsync();
        Task<List<MonthlySalesDto>> GetMonthlySalesTrendAsync(int monthsBack = 12);
        Task<List<AccessorySalesByCategory>> GetAccessorySalesByCategoriesAsync();
        Task<List<AccessoryMonthlySales>> GetAccessoryMonthlySalesTrendAsync(int monthsBack = 12);
        Task<decimal> GetTotalSalesAsync();
        Task<int> GetUnitsSoldAsync();
        Task<decimal> GetAverageSalesAsync();
        Task<decimal> GetAccessorySalesAsync();
        Task<decimal> GetAccessoryAverageSalesAsync();
        Task<int> GetAccessoryCountAsync();
        Task<List<AccessoryPurchaseOnly>> GetAllAccessoriesAsync();
        Task<List<Car>> GetCarsPurchasedByCustomerAsync(string buyerEmail);
        Task AddPurchaseWithAccessoriesAsync(Purchase purchase, List<string> selectedAccessories);
        Task<Purchase?> GetPurchaseByCarAndEmailAsync(int carId, string email);
    }
}