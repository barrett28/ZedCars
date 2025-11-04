using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;
using ZedCars.Net8.Services.Interfaces;

namespace ZedCars.Net8.Services
{
    public class CarRepository : ICarRepository
    {
        private readonly ZedCarsContext _context;

        public CarRepository(ZedCarsContext context)
        {
            _context = context;
        }

        public async Task<List<Car>> GetAllCarsAsync()
        {
            return await _context.Cars
                .Where(c => c.IsActive)
                .OrderByDescending(c => c.CreatedDate)
                .ThenBy(c => c.Model)
                .ToListAsync();
        }

        public async Task<int> GetTotalCarsAsync()
        {
            return await _context.Cars.CountAsync();
        }
        
        public async Task<int> GetActiveCarsAsync()
        {
            return await _context.Cars.CountAsync(c => c.IsActive);
        }

        public async Task<decimal> GetPriceAsync()
        {
            return await _context.Cars.SumAsync(c => c.Price);
        }

        public async Task<Car?> GetCarByIdAsync(int carId)
        {
            return await _context.Cars
                .FirstOrDefaultAsync(c => c.CarId == carId && c.IsActive);
        }

        public async Task<List<Car>> SearchByBrandAsync(string? brand)
        {
            var query = _context.Cars.Where(c => c.IsActive);

            if (!string.IsNullOrEmpty(brand))
            {
                query = query.Where(c => c.Brand.Contains(brand));
            }

            return await query.OrderBy(c => c.Brand).ThenBy(c => c.Model).ToListAsync();
        }

        public async Task<List<Car>> SearchByFuelTypeAsync(string? fuel)
        {
            var query = _context.Cars.Where(c => c.IsActive);
            if (!string.IsNullOrEmpty(fuel))
            {
                query = query.Where(c => c.FuelType.Contains(fuel));
            }
            return await query.OrderBy(c => c.FuelType).ThenBy(c => c.Model).ToListAsync();
        }

        public async Task<List<string>> GetDistinctFuelTypesAsync()
        {
            return await _context.Cars
                                 .Where(c => c.IsActive && !string.IsNullOrEmpty(c.FuelType))
                                 .Select(c => c.FuelType!)
                                 .Distinct()
                                 .ToListAsync();
        }

        public async Task<List<Car>> SearchByPriceAsync(decimal price)
        {
            var query = _context.Cars.Where(c => c.IsActive);

            if (price > 0) { 
                query = query.Where(c=> c.Price > price);
            }
            return await query.OrderBy(c => c.Price).ThenBy(c => c.Model).ToListAsync();
        }

        public async Task<List<string>> GetDistinctBrandsAsync()
        {
            return await _context.Cars
                .Where(c => c.IsActive)
                .Select(c => c.Brand)
                .Distinct()
                .OrderBy(b => b)
                .ToListAsync();
        }

        public async Task<List<Car>> GetRandomCarsAsync(int count)
        {
            return await _context.Cars
                .Where(c => c.IsActive)
                .OrderBy(c=> EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }

        public async Task<(List<Car> Cars, int TotalCount)> GetFilteredCarsAsync(string? brand, string? priceRange, string? fuelType, int page, int pageSize)
        {
            var query = _context.Cars.Where(c => c.IsActive);

            if (!string.IsNullOrEmpty(brand))
            {
                query = query.Where(c => c.Brand == brand);
            }

            if (!string.IsNullOrEmpty(fuelType))
            {
                query = query.Where(c => c.FuelType != null && c.FuelType.Contains(fuelType));
            }

            if (!string.IsNullOrEmpty(priceRange))
            {
                var parts = priceRange.Split('-');
                if (parts.Length == 2 &&
                    decimal.TryParse(parts[0], out var minPrice) &&
                    decimal.TryParse(parts[1], out var maxPrice))
                {
                    query = query.Where(c => c.Price >= minPrice && c.Price <= maxPrice);
                }
            }

            var totalCount = await query.CountAsync();
            var cars = await query
                .OrderBy(c => c.Brand)
                .ThenBy(c => c.Model)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (cars, totalCount);
        }

        public async Task<Car> AddCarAsync(Car car)
        {
            car.IsActive = true;
            car.CreatedDate = DateTime.Now;
            car.ModifiedDate = DateTime.Now;

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            return car;
        }

        public async Task<Car?> UpdateCarAsync(Car car)
        {
            var existingCar = await _context.Cars.FindAsync(car.CarId);
            if (existingCar == null) return null;

            existingCar.Brand = car.Brand;
            existingCar.Model = car.Model;
            existingCar.Variant = car.Variant;
            existingCar.Price = car.Price;
            existingCar.StockQuantity = car.StockQuantity;
            existingCar.Color = car.Color;
            existingCar.Year = car.Year;
            existingCar.FuelType = car.FuelType;
            existingCar.Transmission = car.Transmission;
            existingCar.Mileage = car.Mileage;
            existingCar.Description = car.Description;
            existingCar.ImageUrl = car.ImageUrl;
            existingCar.ModifiedDate = DateTime.Now;
            existingCar.ModifiedBy = car.ModifiedBy;

            await _context.SaveChangesAsync();
            return existingCar;
        }

        public async Task<bool> DeleteCarAsync(int carId, string modifiedBy)
        {
            var car = await _context.Cars.FindAsync(carId);
            if (car == null) return false;

            car.IsActive = false;
            car.ModifiedDate = DateTime.Now;
            car.ModifiedBy = modifiedBy;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
