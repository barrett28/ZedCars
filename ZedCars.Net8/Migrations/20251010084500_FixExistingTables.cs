using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ZedCars.Net8.Migrations
{
    /// <inheritdoc />
    public partial class FixExistingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Check if tables exist and create them if they don't
            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS `PurchaseAccessoryWithCar` (
                    `PurchaseAccessoryId` int NOT NULL AUTO_INCREMENT,
                    `PurchaseId` int NOT NULL,
                    `AccessoryName` varchar(100) NOT NULL,
                    PRIMARY KEY (`PurchaseAccessoryId`),
                    KEY `IX_PurchaseAccessoryWithCar_PurchaseId` (`PurchaseId`),
                    CONSTRAINT `FK_PurchaseAccessoryWithCar_Purchases_PurchaseId` FOREIGN KEY (`PurchaseId`) REFERENCES `Purchases` (`PurchaseId`) ON DELETE CASCADE
                );
            ");

            migrationBuilder.Sql(@"
                CREATE TABLE IF NOT EXISTS `AccessoryPurchaseOnly` (
                    `AccessoryPurchaseId` int NOT NULL AUTO_INCREMENT,
                    `BuyerName` varchar(100) NOT NULL,
                    `BuyerEmail` longtext NOT NULL,
                    `SelectedAccessoriesString` varchar(1000) NOT NULL,
                    `TotalPrice` decimal(18,2) NOT NULL,
                    `PurchaseDate` datetime(6) NOT NULL,
                    PRIMARY KEY (`AccessoryPurchaseId`)
                );
            ");

            // Remove AccessoryId column if it exists in AccessoryPurchaseOnly
            migrationBuilder.Sql(@"
                SET @sql = (SELECT IF(
                    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'AccessoryPurchaseOnly' 
                     AND COLUMN_NAME = 'AccessoryId') > 0,
                    'ALTER TABLE AccessoryPurchaseOnly DROP FOREIGN KEY FK_AccessoryPurchaseOnly_Accessories_AccessoryId',
                    'SELECT 1'
                ));
                PREPARE stmt FROM @sql;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
            ");

            migrationBuilder.Sql(@"
                SET @sql = (SELECT IF(
                    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'AccessoryPurchaseOnly' 
                     AND COLUMN_NAME = 'AccessoryId') > 0,
                    'ALTER TABLE AccessoryPurchaseOnly DROP COLUMN AccessoryId',
                    'SELECT 1'
                ));
                PREPARE stmt FROM @sql;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "PurchaseAccessoryWithCar");
            migrationBuilder.DropTable(name: "AccessoryPurchaseOnly");
        }
    }
}
