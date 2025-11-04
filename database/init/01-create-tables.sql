-- ZedCars Database Schema
-- This creates the complete database structure for the legacy application

USE zoomcars_inventory;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS Accessories;
DROP TABLE IF EXISTS Cars;
DROP TABLE IF EXISTS Admins;

-- Create Admins table
CREATE TABLE Admins (
    AdminId INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Department VARCHAR(50),
    Role VARCHAR(30) NOT NULL DEFAULT 'User',
    PhoneNumber VARCHAR(20),
    IsActive BOOLEAN DEFAULT TRUE,
    Permissions TEXT,
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    LastLoginDate TIMESTAMP NULL,
    INDEX idx_username (Username),
    INDEX idx_email (Email),
    INDEX idx_active (IsActive)
);

-- Create Cars table
CREATE TABLE Cars (
    CarId INT AUTO_INCREMENT PRIMARY KEY,
    Model VARCHAR(100) NOT NULL,
    Brand VARCHAR(50) NOT NULL,
    Variant VARCHAR(50),
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT DEFAULT 0,
    Color VARCHAR(20),
    Year VARCHAR(4),
    FuelType VARCHAR(20),
    Transmission VARCHAR(20),
    Mileage INT,
    Description TEXT,
    ImageUrl VARCHAR(200),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(50),
    ModifiedBy VARCHAR(50),
    IsActive BOOLEAN DEFAULT TRUE,
    INDEX idx_brand (Brand),
    INDEX idx_model (Model),
    INDEX idx_price (Price),
    INDEX idx_active (IsActive),
    INDEX idx_stock (StockQuantity)
);

-- Create Accessories table
CREATE TABLE Accessories (
    AccessoryId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Price DECIMAL(8,2) NOT NULL,
    StockQuantity INT DEFAULT 0,
    Description TEXT,
    PartNumber VARCHAR(50),
    Manufacturer VARCHAR(50),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ModifiedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(50),
    ModifiedBy VARCHAR(50),
    IsActive BOOLEAN DEFAULT TRUE,
    INDEX idx_category (Category),
    INDEX idx_name (Name),
    INDEX idx_manufacturer (Manufacturer),
    INDEX idx_active (IsActive)
);

-- Create a view for active cars (useful for the application)
CREATE VIEW ActiveCars AS
SELECT * FROM Cars WHERE IsActive = TRUE AND StockQuantity > 0;

-- Create a view for low stock items
CREATE VIEW LowStockItems AS
SELECT 'Car' as ItemType, CarId as ItemId, CONCAT(Brand, ' ', Model) as ItemName, StockQuantity
FROM Cars 
WHERE IsActive = TRUE AND StockQuantity <= 5
UNION ALL
SELECT 'Accessory' as ItemType, AccessoryId as ItemId, Name as ItemName, StockQuantity
FROM Accessories 
WHERE IsActive = TRUE AND StockQuantity <= 10;

COMMIT;
