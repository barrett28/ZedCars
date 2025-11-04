using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services.Interfaces;

namespace ZedCars.Net8.Services
{
    public class AccessoryRepository : IAccessoryRepository
    {
        private readonly ZedCarsContext _context;

        public AccessoryRepository(ZedCarsContext context)
        {
            _context = context;
        }

        public async Task<List<Accessory>> GetActiveAccessoriesAsync()
        {
            return await _context.Accessories
                .Where(a => a.IsActive)
                .OrderBy(a => a.Category)
                .ThenBy(a => a.Name)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalAccessoryValueAsync()
        {
            return await _context.Accessories.SumAsync(a => a.Price ?? 0);
        }

        public async Task<decimal> GetAccessoryPricesByNamesAsync(List<string> accessoryNames)
        {
            return await _context.Accessories
                .Where(a => accessoryNames.Contains(a.Name ?? string.Empty))
                .SumAsync(a => a.Price ?? 0);
        }

        public async Task<AccessoryPurchaseOnly> AddAccessoryPurchaseAsync(AccessoryPurchaseOnly purchase)
        {
            _context.AccessoryPurchaseOnly.Add(purchase);
            await _context.SaveChangesAsync();
            return purchase;
        }

        public async Task<List<AccessoryPurchaseOnly>> GetAccessoryPurchasesByEmailAsync(string email)
        {
            return await _context.AccessoryPurchaseOnly
                .Where(ap => ap.BuyerEmail == email)
                .OrderByDescending(ap => ap.PurchaseDate)
                .ToListAsync();
        }
    }
}
