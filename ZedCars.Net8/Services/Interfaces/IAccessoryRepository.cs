using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services.Interfaces
{
    public interface IAccessoryRepository
    {
        Task<List<Accessory>> GetActiveAccessoriesAsync();
        Task<decimal> GetTotalAccessoryValueAsync();
        Task<decimal> GetAccessoryPricesByNamesAsync(List<string> accessoryNames);
        Task<AccessoryPurchaseOnly> AddAccessoryPurchaseAsync(AccessoryPurchaseOnly purchase);
        Task<List<AccessoryPurchaseOnly>> GetAccessoryPurchasesByEmailAsync(string email);
    }
}
