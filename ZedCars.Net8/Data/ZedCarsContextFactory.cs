using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ZedCars.Net8.Data
{
    public class ZedCarsContextFactory : IDesignTimeDbContextFactory<ZedCarsContext>
    {
        public ZedCarsContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ZedCarsContext>();
            
            // Use the same connection string as the application
            optionsBuilder.UseMySql(
                "Server=localhost;Database=zoomcars_inventory;Uid=zoomcars_user;Pwd=admin123;Port=3306;SslMode=None;AllowUserVariables=True;",
                ServerVersion.AutoDetect("Server=localhost;Database=zoomcars_inventory;Uid=zoomcars_user;Pwd=admin123;Port=3306;SslMode=None;AllowUserVariables=True;")
            );

            return new ZedCarsContext(optionsBuilder.Options);
        }
    }
}
