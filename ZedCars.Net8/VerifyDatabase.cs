using Microsoft.EntityFrameworkCore;
using ZedCars.Net8.Data;
using ZedCars.Net8.Models;

namespace ZedCars.Net8
{
    public class DatabaseVerifier
    {
        public static async Task VerifyDatabaseAsync(string connectionString)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ZedCarsContext>();
            optionsBuilder.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21)));

            try
            {
                using var context = new ZedCarsContext(optionsBuilder.Options);
                
                Console.WriteLine("Testing database connection...");
                
                // Test basic connection
                var canConnect = await context.Database.CanConnectAsync();
                Console.WriteLine($"Can connect to database: {canConnect}");
                
                if (canConnect)
                {
                    // Test each table
                    Console.WriteLine("\nTesting table access:");
                    
                    try
                    {
                        var carCount = await context.Cars.CountAsync();
                        Console.WriteLine($"✓ Cars table: {carCount} records");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"✗ Cars table error: {ex.Message}");
                    }
                    
                    try
                    {
                        var accessoryCount = await context.Accessories.CountAsync();
                        Console.WriteLine($"✓ Accessories table: {accessoryCount} records");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"✗ Accessories table error: {ex.Message}");
                    }
                    
                    try
                    {
                        var purchaseCount = await context.Purchases.CountAsync();
                        Console.WriteLine($"✓ Purchases table: {purchaseCount} records");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"✗ Purchases table error: {ex.Message}");
                    }
                    
                    try
                    {
                        var accessoryPurchaseCount = await context.AccessoryPurchaseOnly.CountAsync();
                        Console.WriteLine($"✓ AccessoryPurchaseOnly table: {accessoryPurchaseCount} records");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"✗ AccessoryPurchaseOnly table error: {ex.Message}");
                    }
                    
                    try
                    {
                        var purchaseAccessoryCount = await context.PurchaseAccessoryWithCar.CountAsync();
                        Console.WriteLine($"✓ PurchaseAccessoryWithCar table: {purchaseAccessoryCount} records");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"✗ PurchaseAccessoryWithCar table error: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Database connection failed: {ex.Message}");
            }
        }
    }
}
