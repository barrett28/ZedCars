-- ZedCars Database Tables and Data (without user creation)
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

-- Insert Admin Users
INSERT INTO Admins (Username, Password, FullName, Email, Department, Role, PhoneNumber, IsActive, Permissions) VALUES
('admin1', 'password123', 'John Smith', 'john.smith@zedcars.com', 'Inventory', 'Manager', '555-0101', TRUE, 'inventory,sales,reports'),
('admin2', 'password123', 'Sarah Johnson', 'sarah.johnson@zedcars.com', 'Sales', 'Senior', '555-0102', TRUE, 'sales,reports'),
('superadmin', 'admin123', 'Super Administrator', 'super@zedcars.com', 'Management', 'SuperAdmin', '555-0110', TRUE, 'all,inventory,sales,reports,admin'),
('manager1', 'manager123', 'Mike Wilson', 'mike.wilson@zedcars.com', 'Operations', 'Manager', '555-0103', TRUE, 'inventory,reports'),
('sales1', 'sales123', 'Lisa Davis', 'lisa.davis@zedcars.com', 'Sales', 'Associate', '555-0104', TRUE, 'sales');

-- Insert Cars
INSERT INTO Cars (Model, Brand, Variant, Price, StockQuantity, Color, Year, FuelType, Transmission, Mileage, Description, CreatedBy, IsActive) VALUES
-- Toyota Models
('Camry', 'Toyota', 'LE', 24000.00, 15, 'White', '2024', 'Gasoline', 'Automatic', 28, 'Reliable mid-size sedan with excellent fuel economy', 'admin1', TRUE),
('Camry', 'Toyota', 'XLE', 28000.00, 10, 'Silver', '2024', 'Gasoline', 'Automatic', 28, 'Premium Camry with leather interior', 'admin1', TRUE),
('Corolla', 'Toyota', 'L', 22000.00, 20, 'Blue', '2024', 'Gasoline', 'Automatic', 32, 'Compact car perfect for city driving', 'admin1', TRUE),
('Prius', 'Toyota', 'LE', 27000.00, 8, 'Green', '2024', 'Hybrid', 'CVT', 50, 'Eco-friendly hybrid vehicle', 'admin1', TRUE),
('RAV4', 'Toyota', 'XLE', 32000.00, 12, 'Red', '2024', 'Gasoline', 'Automatic', 27, 'Compact SUV with AWD capability', 'admin1', TRUE),

-- Honda Models
('Accord', 'Honda', 'LX', 25000.00, 12, 'Black', '2024', 'Gasoline', 'Automatic', 30, 'Popular family sedan with spacious interior', 'admin1', TRUE),
('Accord', 'Honda', 'EX', 29000.00, 8, 'White', '2024', 'Gasoline', 'Automatic', 30, 'Mid-level Accord with sunroof', 'admin1', TRUE),
('Civic', 'Honda', 'LX', 23000.00, 18, 'Gray', '2024', 'Gasoline', 'Manual', 31, 'Sporty compact car', 'admin1', TRUE),
('CR-V', 'Honda', 'EX', 30000.00, 10, 'Blue', '2024', 'Gasoline', 'Automatic', 28, 'Versatile compact SUV', 'admin1', TRUE),

-- Ford Models
('Mustang', 'Ford', 'GT', 35000.00, 8, 'Red', '2024', 'Gasoline', 'Manual', 20, 'Iconic American sports car', 'admin1', TRUE),
('Mustang', 'Ford', 'EcoBoost', 32000.00, 6, 'Yellow', '2024', 'Gasoline', 'Automatic', 23, 'Turbocharged Mustang', 'admin1', TRUE),
('F-150', 'Ford', 'XLT', 38000.00, 15, 'Black', '2024', 'Gasoline', 'Automatic', 22, 'Americas best-selling truck', 'admin1', TRUE),
('Explorer', 'Ford', 'XLT', 36000.00, 9, 'White', '2024', 'Gasoline', 'Automatic', 24, 'Three-row family SUV', 'admin1', TRUE),

-- BMW Models
('3 Series', 'BMW', '320i', 40000.00, 10, 'Blue', '2024', 'Gasoline', 'Automatic', 26, 'Luxury compact sedan with premium features', 'admin1', TRUE),
('3 Series', 'BMW', '330i', 45000.00, 7, 'Black', '2024', 'Gasoline', 'Automatic', 25, 'Performance-oriented 3 Series', 'admin1', TRUE),
('X3', 'BMW', 'xDrive30i', 48000.00, 5, 'White', '2024', 'Gasoline', 'Automatic', 23, 'Luxury compact SUV', 'admin1', TRUE),

-- Mercedes Models
('C-Class', 'Mercedes', 'C300', 42000.00, 7, 'Silver', '2024', 'Gasoline', 'Automatic', 25, 'Premium luxury sedan', 'admin1', TRUE),
('E-Class', 'Mercedes', 'E350', 55000.00, 4, 'Black', '2024', 'Gasoline', 'Automatic', 23, 'Executive luxury sedan', 'admin1', TRUE),
('GLC', 'Mercedes', 'GLC300', 50000.00, 6, 'White', '2024', 'Gasoline', 'Automatic', 22, 'Luxury compact SUV', 'admin1', TRUE),

-- Audi Models
('A4', 'Audi', 'Premium', 39000.00, 8, 'Gray', '2024', 'Gasoline', 'Automatic', 27, 'German engineering excellence', 'admin1', TRUE),
('Q5', 'Audi', 'Premium Plus', 47000.00, 5, 'Blue', '2024', 'Gasoline', 'Automatic', 24, 'Luxury SUV with Quattro AWD', 'admin1', TRUE),

-- Low stock items for testing
('Model S', 'Tesla', 'Long Range', 85000.00, 2, 'White', '2024', 'Electric', 'Automatic', 120, 'Premium electric sedan', 'admin1', TRUE),
('Wrangler', 'Jeep', 'Sport', 35000.00, 3, 'Green', '2024', 'Gasoline', 'Manual', 21, 'Iconic off-road vehicle', 'admin1', TRUE);

-- Insert Accessories
INSERT INTO Accessories (Name, Category, Price, StockQuantity, Description, PartNumber, Manufacturer, CreatedBy, IsActive) VALUES
-- Interior Accessories
('All-Weather Floor Mats', 'Interior', 89.99, 50, 'Durable rubber floor protection for all seasons', 'FM-001', 'WeatherTech', 'admin1', TRUE),
('Premium Seat Covers', 'Interior', 149.99, 30, 'Leather-like seat protection with custom fit', 'SC-002', 'Covercraft', 'admin1', TRUE),
('Dashboard Cover', 'Interior', 45.99, 25, 'UV protection for dashboard', 'DC-003', 'DashMat', 'admin1', TRUE),
('Steering Wheel Cover', 'Interior', 19.99, 40, 'Comfortable grip enhancement', 'SWC-004', 'BDK', 'admin1', TRUE),

-- Electronics
('GPS Navigation System', 'Electronics', 399.99, 20, 'Touch screen GPS with voice guidance', 'GPS-201', 'Garmin', 'admin1', TRUE),
('Backup Camera', 'Electronics', 199.99, 30, 'Rear view safety camera system', 'BC-202', 'Pioneer', 'admin1', TRUE),
('Dash Camera', 'Electronics', 129.99, 35, 'HD recording dash camera', 'DASH-203', 'Nextbase', 'admin1', TRUE),
('Phone Mount', 'Electronics', 24.99, 60, 'Secure phone holder', 'PM-205', 'iOttie', 'admin1', TRUE),

-- Exterior Accessories
('Body Kit', 'Exterior', 899.99, 10, 'Aerodynamic body enhancement package', 'BK-101', 'Duraflex', 'admin1', TRUE),
('Roof Rack', 'Exterior', 299.99, 15, 'Universal roof cargo carrier', 'RR-102', 'Thule', 'admin1', TRUE),
('Window Tinting', 'Exterior', 199.99, 25, 'Professional window tint service', 'WT-103', '3M', 'admin1', TRUE),
('LED Light Bar', 'Exterior', 159.99, 12, 'Off-road LED lighting', 'LED-105', 'Rigid Industries', 'admin1', TRUE),

-- Performance Parts
('Cold Air Intake', 'Performance', 249.99, 8, 'High-flow air intake system', 'CAI-301', 'K&N', 'admin1', TRUE),
('Exhaust System', 'Performance', 599.99, 5, 'Performance exhaust upgrade', 'EX-302', 'Borla', 'admin1', TRUE),

-- Maintenance Items
('Oil Filter', 'Maintenance', 12.99, 100, 'High-quality oil filter', 'OF-401', 'Fram', 'admin1', TRUE),
('Air Filter', 'Maintenance', 19.99, 75, 'Engine air filter', 'AF-402', 'K&N', 'admin1', TRUE),
('Brake Pads', 'Maintenance', 89.99, 40, 'Ceramic brake pads', 'BP-403', 'Akebono', 'admin1', TRUE),
('Wiper Blades', 'Maintenance', 24.99, 60, 'All-season wiper blades', 'WB-404', 'Bosch', 'admin1', TRUE),

-- Low stock items for testing alerts
('Turbo Kit', 'Performance', 1999.99, 2, 'Complete turbocharger system', 'TK-305', 'Garrett', 'admin1', TRUE),
('Racing Seats', 'Interior', 799.99, 3, 'Professional racing seats', 'RS-007', 'Recaro', 'admin1', TRUE);

-- Create useful views
CREATE VIEW ActiveCars AS
SELECT * FROM Cars WHERE IsActive = TRUE AND StockQuantity > 0;

CREATE VIEW LowStockItems AS
SELECT 'Car' as ItemType, CarId as ItemId, CONCAT(Brand, ' ', Model) as ItemName, StockQuantity
FROM Cars 
WHERE IsActive = TRUE AND StockQuantity <= 5
UNION ALL
SELECT 'Accessory' as ItemType, AccessoryId as ItemId, Name as ItemName, StockQuantity
FROM Accessories 
WHERE IsActive = TRUE AND StockQuantity <= 10;

-- Display setup completion message
SELECT 'Database setup completed successfully!' as Status,
       (SELECT COUNT(*) FROM Cars) as Cars,
       (SELECT COUNT(*) FROM Admins) as Admins,
       (SELECT COUNT(*) FROM Accessories) as Accessories;

COMMIT;
