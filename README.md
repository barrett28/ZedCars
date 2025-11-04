# DISCLAIMER

This application is for demonstration and learning purposes only. It is not intended for production use. The ZedCars application was created to showcase ASP.NET MVC 3 development techniques and should be used solely for educational purposes.

# ZedCars - Vehicle Inventory Management System

ZedCars is a web-based vehicle inventory management system originally built with ASP.NET MVC 3, now successfully migrated to .NET 8 MVC Core. It allows users to browse vehicle listings and administrators to manage inventory, users, and generate reports.

## Migration Status: ✅ COMPLETED

**Original:** ASP.NET MVC 3 (.NET Framework 4.0) → **Migrated:** .NET 8 MVC Core  
**Migration Date:** October 2025  
**Migration Tool:** Amazon Q Developer

## Features

- Vehicle inventory browsing and filtering
- User authentication and role-based access control
- Admin dashboard with analytics
- Vehicle management (add, edit, delete)
- User management
- Reporting functionality
- Purchase tracking system
- Accessory management

## Architecture

### Original (.NET Framework 4.0)
- **Framework**: ASP.NET MVC 3 with Web Forms views (.aspx)
- **Authentication**: Forms Authentication with custom role provider
- **Data Access**: ADO.NET with direct MySQL connections
- **Configuration**: Web.config XML-based configuration

### Migrated (.NET 8)
- **Framework**: ASP.NET Core MVC with Razor views (.cshtml)
- **Authentication**: Cookie Authentication with role-based authorization
- **Data Access**: Entity Framework Core with repository pattern
- **Configuration**: JSON-based configuration (appsettings.json)
- **Dependency Injection**: Built-in DI container
- **Async/Await**: Modern asynchronous programming patterns

## Setup Instructions

### Prerequisites

- **.NET 8 SDK**: Download from https://dotnet.microsoft.com/download/dotnet/8.0
- **MySQL**: Version 5.7 or 8.0
- **IDE**: Visual Studio 2022, VS Code, or JetBrains Rider

### Step 1: Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE zoomcars_inventory;
   ```

2. **Create User**
   ```sql
   CREATE USER 'zoomcars_user'@'localhost' IDENTIFIED BY 'admin123';
   GRANT ALL PRIVILEGES ON zoomcars_inventory.* TO 'zoomcars_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run Database Scripts**
   - Navigate to the `ZedCars.Net8` folder in the project
   - Run the following scripts in order:
     ```bash
     mysql -u zoomcars_user -p zoomcars_inventory < 01-create-tables.sql
     mysql -u zoomcars_user -p zoomcars_inventory < 02-seed-data.sql
     ```

### Step 2: Application Setup

1. **Navigate to the .NET 8 Project**
   ```bash
   cd ZedCars.Net8
   ```

2. **Restore NuGet Packages**
   ```bash
   dotnet restore
   ```

3. **Update Connection String** (if needed)
   - Open appsettings.json
   - Update the connection string if needed:
     ```json
     {
       "ConnectionStrings": {
         "DefaultConnection": "Server=localhost;Database=zoomcars_inventory;Uid=zoomcars_user;Pwd=admin123;Port=3306;SslMode=None;AllowUserVariables=True;"
       }
     }
     ```

4. **Build the Solution**
   ```bash
   dotnet build
   ```

### Step 3: Run the Application

1. **Start the Application**
   ```bash
   dotnet run
   ```
   - The application will be available at `https://localhost:5001` or `http://localhost:5000`

2. **Login Credentials**
   - Admin User:
     - Username: admin
     - Password: admin123
   - Regular User:
     - Username: user1
     - Password: password1

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify MySQL is running
   - Check connection string in appsettings.json
   - Ensure the user has proper permissions

2. **Build Errors**
   - Make sure all required NuGet packages are restored
   - Verify .NET 8 SDK is installed

3. **Authentication Issues**
   - Check if database tables exist and contain data
   - Verify login credentials match database records

### Additional Resources

- .NET 8 Documentation: https://docs.microsoft.com/en-us/dotnet/
- ASP.NET Core MVC Documentation: https://docs.microsoft.com/en-us/aspnet/core/mvc/
- Entity Framework Core Documentation: https://docs.microsoft.com/en-us/ef/core/
- MySQL Documentation: https://dev.mysql.com/doc/

## Migration Achievements

This project demonstrates successful migration from legacy .NET Framework to modern .NET 8, showcasing:

- **Framework Modernization**: Complete migration from ASP.NET MVC 3 to .NET 8 MVC Core
- **Data Access Evolution**: Transition from ADO.NET to Entity Framework Core
- **Authentication Upgrade**: Modern cookie-based authentication with role management
- **Async Programming**: Implementation of async/await patterns throughout
- **Dependency Injection**: Utilization of built-in DI container
- **Configuration Management**: JSON-based configuration system
- **Repository Pattern**: Clean separation of data access logic

## License

This project is licensed for educational purposes only. Not for commercial use.
