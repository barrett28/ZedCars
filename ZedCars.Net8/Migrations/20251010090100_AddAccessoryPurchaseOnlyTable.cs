using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZedCars.Net8.Migrations
{
    /// <inheritdoc />
    public partial class AddAccessoryPurchaseOnlyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create AccessoryPurchaseOnly table if it doesn't exist
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS AccessoryPurchaseOnly (
                    AccessoryPurchaseId INT AUTO_INCREMENT PRIMARY KEY,
                    BuyerName VARCHAR(100) NOT NULL,
                    BuyerEmail LONGTEXT NOT NULL,
                    SelectedAccessoriesString VARCHAR(1000) NOT NULL,
                    TotalPrice DECIMAL(18,2) NOT NULL,
                    PurchaseDate DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
                );
            ");

            // Ensure PurchaseAccessoryWithCar table exists with correct structure
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS PurchaseAccessoryWithCar (
                    PurchaseAccessoryId INT AUTO_INCREMENT PRIMARY KEY,
                    PurchaseId INT NOT NULL,
                    AccessoryName VARCHAR(100) NOT NULL,
                    FOREIGN KEY (PurchaseId) REFERENCES Purchases(PurchaseId) ON DELETE CASCADE,
                    INDEX IX_PurchaseAccessoryWithCar_PurchaseId (PurchaseId)
                );
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TABLE IF EXISTS AccessoryPurchaseOnly;");
            migrationBuilder.Sql("DROP TABLE IF EXISTS PurchaseAccessoryWithCar;");
        }
    }
}
