using ZedCars.Net8.Models;

namespace ZedCars.Net8.Services.Interfaces
{
    public interface ICarRepository
    {
        Task<List<Car>> GetAllCarsAsync();
        Task<int> GetTotalCarsAsync();
        Task<int> GetActiveCarsAsync();
        Task<decimal> GetPriceAsync();
        Task<Car?> GetCarByIdAsync(int carId);
        Task<List<Car>> SearchByBrandAsync(string? brand);
        Task<List<Car>> SearchByFuelTypeAsync(string? fuel);
        Task<List<string>> GetDistinctFuelTypesAsync();
        Task<List<Car>> SearchByPriceAsync(decimal price);
        Task<List<string>> GetDistinctBrandsAsync();
        Task<List<Car>> GetRandomCarsAsync(int count);
        Task<(List<Car> Cars, int TotalCount)> GetFilteredCarsAsync(string? brand, string? priceRange, string? fuelType, int page, int pageSize);
        Task<Car> AddCarAsync(Car car);
        Task<Car?> UpdateCarAsync(Car car);
        Task<bool> DeleteCarAsync(int carId, string modifiedBy);
    }
}
