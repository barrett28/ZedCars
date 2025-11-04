-- Comprehensive database sync script to match current models
-- Run this script to ensure your database matches the Entity Framework models

USE zoomcars_inventory;

-- 1. Ensure Purchases table has correct structure
DROP TABLE IF EXISTS PurchaseAccessoryWithCar;
DROP TABLE IF EXISTS Purchases;

CREATE TABLE Purchases (
    PurchaseId INT AUTO_INCREMENT PRIMARY KEY,
    CarId INT NOT NULL,
    BuyerName VARCHAR(100) NOT NULL,
    BuyerEmail LONGTEXT NOT NULL,
    PurchaseQuantity INT NOT NULL DEFAULT 1,
    PurchasePrice DECIMAL(18,2) NOT NULL,
    PurchaseDate DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    SelectedAccessoriesString VARCHAR(1000) NULL,
    CONSTRAINT FK_Purchases_Cars_CarId FOREIGN KEY (CarId) REFERENCES Cars(CarId) ON DELETE RESTRICT,
    INDEX IX_Purchases_CarId (CarId)
);

-- 2. Ensure TestDrives table has correct structure
DROP TABLE IF EXISTS TestDrives;

CREATE TABLE TestDrives (
    TestDriveId INT AUTO_INCREMENT PRIMARY KEY,
    CarId INT NOT NULL,
    CustomerName VARCHAR(100) NOT NULL,
    CustomerEmail VARCHAR(100) NOT NULL,
    CustomerPhone VARCHAR(15) NOT NULL,
    BookingDate DATETIME(6) NOT NULL,
    TimeSlot VARCHAR(10) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT FK_TestDrives_Cars_CarId FOREIGN KEY (CarId) REFERENCES Cars(CarId) ON DELETE RESTRICT,
    INDEX IX_TestDrives_BookingDate (BookingDate),
    INDEX IX_TestDrives_CarId (CarId),
    INDEX IX_TestDrives_Status (Status)
);

-- 3. Create AccessoryPurchaseOnly table for standalone accessory purchases
DROP TABLE IF EXISTS AccessoryPurchaseOnly;

CREATE TABLE AccessoryPurchaseOnly (
    AccessoryPurchaseId INT AUTO_INCREMENT PRIMARY KEY,
    BuyerName VARCHAR(100) NOT NULL,
    BuyerEmail LONGTEXT NOT NULL,
    SelectedAccessoriesString VARCHAR(1000) NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    PurchaseDate DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

-- 4. Create PurchaseAccessoryWithCar table for accessories purchased with cars
CREATE TABLE PurchaseAccessoryWithCar (
    PurchaseAccessoryId INT AUTO_INCREMENT PRIMARY KEY,
    PurchaseId INT NOT NULL,
    AccessoryName VARCHAR(100) NOT NULL,
    CONSTRAINT FK_PurchaseAccessoryWithCar_Purchases_PurchaseId FOREIGN KEY (PurchaseId) REFERENCES Purchases(PurchaseId) ON DELETE CASCADE,
    INDEX IX_PurchaseAccessoryWithCar_PurchaseId (PurchaseId)
);

-- 5. Update __EFMigrationsHistory to reflect current state
DELETE FROM __EFMigrationsHistory WHERE MigrationId = '20251010090100_AddAccessoryPurchaseOnlyTable';
INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) 
VALUES ('20251010090100_AddAccessoryPurchaseOnlyTable', '8.0.0');

COMMIT;

-- Verification queries
SELECT 'Database sync completed successfully' as Status;
SHOW TABLES;
