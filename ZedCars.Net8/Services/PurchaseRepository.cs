using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;
using ZedCars.Net8.ViewModels;
using ZedCars.Net8.ViewModels.ReportsCont;

namespace ZedCars.Net8.Services
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly ZedCarsContext _context;

        public PurchaseRepository(ZedCarsContext context)
        {
            _context = context;
        }

        public async Task<Purchase> AddPurchaseAsync(Purchase purchase)
        {
            // ensure car exists and snapshot price
            var car = await _context.Cars.FindAsync(purchase.CarId);
            if (car == null) throw new InvalidOperationException("Car not found");

            // snapshot price if not supplied
            if (purchase.PurchasePrice <= 0)
                purchase.PurchasePrice = car.Price;

            purchase.PurchaseDate = DateTime.Now;

            _context.Purchases.Add(purchase);

            // optional: adjust stock
            if (car.StockQuantity > 0)
            {
                car.StockQuantity = Math.Max((int)car.StockQuantity - (int) purchase.PurchaseQuantity,0);
            }

            await _context.SaveChangesAsync();
            return purchase;
        }

        public async Task<Purchase?> GetPurchaseByIdAsync(int id)
        {
            return await _context.Purchases
                .Include(p => p.Car)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.PurchaseId == id);
        }

        public async Task<List<Purchase>> GetAllPurchasesAsync()
        {
            return await _context.Purchases
                .Include(p => p.Car)
                .AsNoTracking()
                .OrderByDescending(p => p.PurchaseDate)
                .ToListAsync();
        }

        // Cars charts on Sales Reports page

        public async Task<List<SalesByBrandDto>> GetSalesByBrandAsync()
        {
            return await _context.Purchases
                .AsNoTracking()
                .Include(p => p.Car)
                .Where(p => p.Car != null)
                .GroupBy(p => p.Car!.Brand)
                .Select(g => new SalesByBrandDto
                {
                    Brand = g.Key ?? "Unknown",
                    UnitsSold = g.Sum(x => x.PurchaseQuantity),
                    TotalSales = g.Sum(x => x.PurchasePrice * x.PurchaseQuantity),
                    StockAvailable = g.Sum(x => x.Car.StockQuantity ?? 0)
                })
                .OrderByDescending(x => x.TotalSales)
                .ToListAsync();
        }

        public async Task<List<MonthlySalesDto>> GetMonthlySalesTrendAsync(int monthsBack = 12)
        {
            var from = DateTime.Now.AddMonths(-monthsBack + 1);
            return await _context.Purchases
                .AsNoTracking()
                .Where(p => p.PurchaseDate >= from)
                .GroupBy(p => new { p.PurchaseDate.Year, p.PurchaseDate.Month })
                .Select(g => new MonthlySalesDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    UnitsSold = g.Sum(x => x.PurchaseQuantity),
                    TotalSales = g.Sum(x => x.PurchasePrice * x.PurchaseQuantity)
                })
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToListAsync();
        }


        // Accessory charts on Sales Reports page
        public async Task<List<AccessorySalesByCategory>> GetAccessorySalesByCategoriesAsync()
        {

            var accessoryPurchases = await _context.AccessoryPurchaseOnly
                .AsNoTracking()
                .ToListAsync();

            return accessoryPurchases
                .SelectMany(ap => ap.SelectedAccessoriesString.Split(',')
                    .Where(accessory => !string.IsNullOrWhiteSpace(accessory))
                    .Select(accessory => new { AccessoryName = accessory.Trim(), ap.TotalPrice }))
                .Join(_context.Accessories,
                    ap => ap.AccessoryName,
                    acc => acc.Name,
                    (ap, acc) => new { acc.Category, acc.Price })
                .GroupBy(x => x.Category)
                .Select(g => new AccessorySalesByCategory
                {
                    Category = g.Key,
                    UnitsSold = g.Count(),
                    TotalSales = g.Sum(x => (decimal)(x.Price ?? 0))
                })
                .OrderByDescending(x => x.TotalSales)
                .ToList();
        }

        public async Task<List<AccessoryMonthlySales>> GetAccessoryMonthlySalesTrendAsync(int monthsBack = 12)
        {
            var from = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1)
                .AddMonths(-monthsBack + 1);

            return await _context.AccessoryPurchaseOnly
                .AsNoTracking()
                .Where(p => p.PurchaseDate >= from)
                .GroupBy(p => new { p.PurchaseDate.Year, p.PurchaseDate.Month })
                .Select(g => new AccessoryMonthlySales
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    UnitsSold = g.Sum(x => x.AccessoryPurchaseId), 
                    TotalSales = g.Sum(x => x.TotalPrice)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();
        }


        public async Task<decimal> GetTotalSalesAsync()
        {
            var res = await _context.Purchases
                .AsNoTracking()
                .SumAsync(p => p.PurchasePrice * p.PurchaseQuantity);

            return res;
        }

        public async Task<int> GetUnitsSoldAsync()
        {
            return await _context.Purchases
                .AsNoTracking()
                .SumAsync(p => p.PurchaseQuantity);
        }

        public async Task<decimal> GetAverageSalesAsync()
        {
            return await _context.Purchases.AsNoTracking()
                .AverageAsync(p=> p.PurchasePrice);
        }

        public async Task<decimal> GetAccessorySalesAsync()
        {
            return await _context.AccessoryPurchaseOnly.AsNoTracking().SumAsync(a => a.TotalPrice);
        }

        public async Task<decimal> GetAccessoryAverageSalesAsync()
        {
            return await _context.AccessoryPurchaseOnly.AsNoTracking().AverageAsync(a => a.TotalPrice);
        }

        public async Task<int> GetAccessoryCountAsync()
        {
            //return await _context.AccessoryPurchaseOnly.CountAsync();
            var accessoryPurchases = await _context.AccessoryPurchaseOnly.AsNoTracking().ToListAsync();
            return accessoryPurchases.Sum(ap => ap.SelectedAccessories.Count);
        }

        public async Task<List<AccessoryPurchaseOnly>> GetAllAccessoriesAsync()
        {
            return await _context.AccessoryPurchaseOnly
                .AsNoTracking()
                .OrderByDescending(a=>a.PurchaseDate)
                .ToListAsync();
        }

        public async Task<List<Car>> GetCarsPurchasedByCustomerAsync(string buyerEmail)
        {
            var purchases = await _context.Purchases.AsNoTracking()
                .Include(p => p.Car)
                .Where(p => p.BuyerEmail == buyerEmail)
                .ToListAsync();

            return purchases
                .Where(p => p.Car != null)
                .Select(p => p.Car!)
                .ToList();
        }
        
        public async Task AddPurchaseWithAccessoriesAsync(Purchase purchase, List<string> selectedAccessories)
        {
            // Set accessories string in Purchase record
            if (selectedAccessories?.Any() == true)
            {
                purchase.SelectedAccessoriesString = string.Join(",", selectedAccessories);
            }
                        _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync(); // TO generate PurchaseId

            // Add accessories if selected
            if(selectedAccessories?.Any() == true)
            {
                foreach (var accessory in selectedAccessories)
                {
                    var purchaseAccessory = new PurchaseAccessoryWithCar
                    {
                        PurchaseId = purchase.PurchaseId,
                        AccessoryName = accessory
                    };
                    _context.PurchaseAccessoryWithCar.Add(purchaseAccessory);
                }
                await _context.SaveChangesAsync();
            }
        }
        public async Task<Purchase?> GetPurchaseByCarAndEmailAsync(int carId, string email)
        {
            return await _context.Purchases
                .FirstOrDefaultAsync(p => p.CarId == carId && p.BuyerEmail == email);
        }
    }
}
