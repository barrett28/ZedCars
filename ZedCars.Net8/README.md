# ZedCars .NET 8 Migration

This is the migrated version of the ZedCars application from ASP.NET MVC 3 to .NET 8 MVC Core.

## Migration Summary

### What was migrated:
- **Framework**: ASP.NET MVC 3 (.NET Framework 4.0) → .NET 8 MVC Core
- **Data Access**: ADO.NET with MySqlConnection → Entity Framework Core with MySQL 
- **Views**: ASPX Web Forms → Razor Views (.cshtml)
- **Authentication**: Forms Authentication → Cookie Authentication with existing Admins table
- **Configuration**: Web.config → appsettings.json
- **Async/Await**: Synchronous methods → Async/await pattern

### Key Changes:

#### 1. Project Structure
- Modern SDK-style project file
- Simplified folder structure
- Built-in dependency injection

#### 2. Data Access Layer
- **Before**: Direct ADO.NET with MySqlConnection
- **After**: Entity Framework Core with DbContext
- Repository pattern with async methods
- Proper connection string management

#### 3. Authentication System
- **Cookie Authentication**: Uses existing `Admins` table from MySQL database
- **AdminRepository**: Database-first authentication with hardcoded fallback
- **Role-Based Access**: SuperAdmin, Customer roles
- **Session Management**: Secure cookie-based sessions

#### 4. Controllers
- Updated to use async/await pattern
- Dependency injection for repositories
- Modern action result types (IActionResult)
- Proper error handling with NotFound()
- Role-based authorization implemented

#### 5. Views
- Converted from ASPX to Razor syntax
- Strongly typed views with @model directive
- Modern HTML helpers and tag helpers
- Responsive design maintained

#### 6. Configuration
- Connection strings moved to appsettings.json
- Environment-specific configuration support
- Structured logging configuration

## Prerequisites

- **.NET 8 SDK**: Download from https://dotnet.microsoft.com/download/dotnet/8.0
- **MySQL**: Version 5.7 or 8.0
- **IDE**: Visual Studio 2022, VS Code, or JetBrains Rider

## Setup Instructions

### 1. Database Setup
Create the database and user:

```sql
CREATE DATABASE zoomcars_inventory;
CREATE USER 'zoomcars_user'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON zoomcars_inventory.* TO 'zoomcars_user'@'localhost';
FLUSH PRIVILEGES;
```

Run the database scripts:
```bash
mysql -u zoomcars_user -padmin123 zoomcars_inventory < ../ZedCars/01-create-tables.sql
mysql -u zoomcars_user -padmin123 zoomcars_inventory < ../ZedCars/02-seed-data.sql
```

### 2. Application Setup

1. **Clone/Navigate to the project**:
   ```bash
   cd ZedCars.Net8
   ```

2. **Restore packages**:
   ```bash
   dotnet restore
   ```

3. **Update connection string** (if needed):
   Edit `appsettings.json` and update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=zoomcars_inventory;Uid=zoomcars_user;Pwd=admin123;Port=3306;SslMode=None;AllowUserVariables=True;"
     }
   }
   ```

4. **Build the application**:
   ```bash
   dotnet build
   ```

5. **Run the application**:
   ```bash
   dotnet run
   ```

The application will be available at `https://localhost:5001` or `http://localhost:5000`.

## Authentication & User Accounts

### Available Login Credentials:

**Database Users (from MySQL Admins table):**
- **superadmin** / **admin1** → Role: SuperAdmin (Full access)
- **sales1** / **Customer1** → Role: Custoomer (Limited access)

### Role-Based Access:
- **SuperAdmin/Manager**: Access to Admin Dashboard, Inventory Management, All Home pages, Reports page
- **Customer**: Access to Home pages, Vehicle Inventory

## Features

### Core Features:
- Vehicle inventory browsing with model-specific images
- Vehicle detail pages with dynamic content
- Responsive design
- MySQL database integration
- Role-based authentication and authorization

### Admin Features (SuperAdmin/Manager):
- Admin Dashboard with inventory overview
- Add/Edit/Delete vehicles
- Inventory management
- User role management

### Customer Features:
- Browse vehicle inventory and purchase
- View vehicle details
- Contact information
- About page

## Architecture Improvements

### 1. Authentication System
```csharp
// Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.LoginPath = "/Account/Login";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    });

// AdminRepository for database authentication
builder.Services.AddScoped<AdminRepository>();
```

### 2. Repository Pattern
```csharp
// Consistent data access pattern
public class AdminRepository
{
    // Database-first with fallback
    public async Task<Admin?> ValidateAdminAsync(string username, string password)
    {
        try {
            return await _context.Admins.FirstOrDefaultAsync(/*...*/);
        } catch {
            return GetHardcodedAdmins().FirstOrDefault(/*...*/);
        }
    }
}
```

### 3. Entity Framework Core
- Code-first approach with DbContext
- Async operations for better performance
- Proper entity configuration
- Connection pooling and optimization

### 4. Modern C# Features
- Nullable reference types enabled
- Using statements and implicit usings
- Modern async/await patterns
- Dependency injection throughout

## Development Notes

### Running in Development
```bash
dotnet run --environment Development
```

### Database Migrations (Future)
If you need to modify the database schema:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Updating Car Images
To update vehicle images with model-specific photos:
```bash
mysql -u zoomcars_user -padmin123 zoomcars_inventory < update-car-images.sql
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure MySQL is running and credentials are correct
2. **Authentication Issues**: Check if Admins table exists and has proper data
3. **Port Conflicts**: Change ports in `launchSettings.json` if needed
4. **Package Restore**: Run `dotnet restore` if packages are missing
5. **Role Access**: Verify user roles match controller authorization requirements

### Logs
Check application logs in the console output or configure file logging in `appsettings.json`.

## Project Structure & File Explanations

```
ZedCars.Net8/
├── Controllers/                # MVC Controllers - Handle HTTP requests and responses
│   ├── AccessoryController.cs  # Manages vehicle accessories
│   ├── AccountController.cs    # Manages user login/logout/registration
│   ├── AdminController.cs      # Handles admin dashboard, vehicle management, reports
│   ├── ChatController.cs       # Chat functionality
│   ├── HomeController.cs       # Public pages (home, inventory, about, contact)
│   └── ReportsController.cs    # Business reporting functionality
│
├── Data/                       # Database Context Layer
│   └── ZedCarsContext.cs       # EF Core DbContext - Database connection and entity configuration
│
├── Models/                     # Data Models - Define database entities and view models
│   ├── Accessory.cs           # Vehicle accessory entity
│   ├── Admin.cs               # Admin user entity (username, password, role)
│   ├── Car.cs                 # Vehicle entity (brand, model, price, description, etc.)
│   ├── ErrorViewModel.cs      # Error handling model
│   ├── Purchase.cs            # Purchase transaction entity
│   ├── ReportsDto.cs          # Data transfer objects for reports
│   └── UserInfo.cs            # User information model
│
├── Services/                   # Service Layer - Business logic and data access
│   ├── AdminRepository.cs     # Admin authentication and user management logic
│   ├── CarRepository.cs       # Vehicle CRUD operations and inventory management
│   ├── ImageService.cs        # Image handling and processing utilities
│   └── PurchaseRepository.cs  # Purchase transaction management
│
├── Views/                      # Razor Views - HTML templates with C# code
│   ├── Accessory/             # Accessory management pages
│   ├── Account/               # Authentication pages
│   │   ├── Login.cshtml       # User login form
│   │   └── Register.cshtml    # User registration form
│   ├── Admin/                 # Admin management interface
│   │   ├── Dashboard.cshtml   # Admin overview with stats and charts
│   │   ├── AddVehicle.cshtml  # Form to add new vehicles
│   │   ├── EditVehicle.cshtml # Form to edit existing vehicles
│   │   ├── Inventory.cshtml   # Vehicle inventory management table
│   │   ├── Reports.cshtml     # Business reports and analytics
│   │   └── ManageUsers.cshtml # User role management
│   ├── Home/                  # Public-facing pages
│   │   ├── Index.cshtml       # Homepage with featured vehicles
│   │   ├── Inventory.cshtml   # Public vehicle browsing page
│   │   ├── About.cshtml       # Company information page
│   │   ├── Contact.cshtml     # Contact information and form
│   │   ├── MyPurchases.cshtml # Customer purchase history
│   │   ├── Privacy.cshtml     # Privacy policy page
│   │   ├── Purchase.cshtml    # Vehicle purchase form
│   │   └── VehicleDetail.cshtml # Individual vehicle details page
│   └── Shared/                # Shared layout and components
│       ├── _Layout.cshtml     # Main site layout (header, nav, footer)
│       └── Error.cshtml       # Error page template
│
├── wwwroot/                    # Static Files - Client-side assets
│   ├── css/                   # Custom stylesheets
│   ├── js/                    # JavaScript files
│   └── images/                # Vehicle images and site graphics
│
├── Migrations/                 # Entity Framework migrations
├── appsettings.json           # Configuration - Database connections, app settings
├── Program.cs                 # Application startup - DI container, middleware setup
└── ZedCars.Net8.csproj       # Project file - Dependencies and build configuration
```
### Layer Responsibilities

#### **Controller Layer** (`Controllers/`)
- **Purpose**: Handle HTTP requests, coordinate between services and views
- **AccountController**: User authentication (login/logout/register)
- **AdminController**: Admin operations (dashboard, vehicle management, reports)
- **HomeController**: Public pages (homepage, inventory browsing, contact)

#### **Service Layer** (`Services/`)
- **Purpose**: Business logic and data access operations
- **AdminRepository**: User authentication, role management, admin operations
- **CarRepository**: Vehicle CRUD operations, inventory management, search/filter
- **ImageService**: Image processing, file handling, URL generation
- **PurchaseRepository**: Purchase transaction management, sales reporting

#### **Data Layer** (`Data/`)
- **Purpose**: Database connectivity and entity configuration
- **ZedCarsContext**: EF Core context, database connection, entity relationships

#### **Model Layer** (`Models/`)
- **Purpose**: Define data structures and entities
- **Admin**: User accounts, roles, authentication data
- **Car**: Vehicle information, pricing, specifications
- **Purchase**: Purchase transactions, buyer information
- **Accessory**: Vehicle accessories and add-ons
- **ReportsDto**: Data transfer objects for business reports

#### **View Layer** (`Views/`)
- **Purpose**: User interface templates with server-side rendering
- **Account**: Authentication UI (login/register forms)
- **Admin**: Management interface (dashboards, forms, tables)
- **Home**: Public website (product pages, company info)
- **Shared**: Common layouts and reusable components

## Next Steps

Potential future enhancements:

- Implement advanced search and filtering
- Integration with AWS services
