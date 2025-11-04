# ZedCars Integrated Vite JSX Migration Plan
**Single Project: .NET 8 MVC + Vite JSX Frontend**

## Overview
Integrate Vite + JSX frontend into existing ZedCars.Net8 project structure, serving both MVC views and modern JSX components from the same application.

## Integrated Architecture
- **Backend**: Existing .NET 8 MVC (add API endpoints)
- **Frontend**: Vite + JSX integrated in `/ClientApp` folder
- **Build Process**: Vite builds to `wwwroot/dist`
- **Development**: Hot reload for JSX, existing MVC for fallback

---

## Project Structure Integration

```
ZedCars.Net8/                        # Existing Project Root
├── Controllers/                     # Existing (add API endpoints)
├── Views/                          # Existing Razor views (keep for fallback)
├── Services/                       # Existing repositories
├── Models/                         # Existing models
├── Data/                           # Existing EF context
├── ClientApp/                      # NEW - Vite JSX Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── AuthGuard.jsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── VehicleTable.jsx
│   │   │   │   └── VehicleForm.jsx
│   │   │   ├── customer/
│   │   │   │   ├── VehicleCard.jsx
│   │   │   │   ├── InventoryGrid.jsx
│   │   │   │   └── PurchaseForm.jsx
│   │   │   └── shared/
│   │   │       ├── Header.jsx
│   │   │       ├── Navigation.jsx
│   │   │       └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── VehicleDetailPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── VehicleManagement.jsx
│   │   │       └── Reports.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── vehicleService.js
│   │   │   └── authService.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── wwwroot/
│   ├── css/                        # Existing styles
│   ├── js/                         # Existing scripts
│   ├── images/                     # Existing images
│   └── dist/                       # NEW - Vite build output
├── appsettings.json                # Existing
├── Program.cs                      # Modified for SPA support
└── ZedCars.Net8.csproj            # Modified
```

---

## Implementation Steps

### 1. Project Configuration (1 day)

#### Update ZedCars.Net8.csproj
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <SpaRoot>ClientApp\</SpaRoot>
    <DefaultItemExcludes>$(DefaultItemExcludes);$(SpaRoot)node_modules\**</DefaultItemExcludes>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.SpaServices.Extensions" Version="8.0.0" />
  </ItemGroup>

  <ItemGroup>
    <Content Remove="$(SpaRoot)**" />
    <None Remove="$(SpaRoot)**" />
    <None Include="$(SpaRoot)**" Exclude="$(SpaRoot)node_modules\**" />
  </ItemGroup>

  <Target Name="PublishRunWebpack" AfterTargets="ComputeFilesToPublish">
    <Exec WorkingDirectory="$(SpaRoot)" Command="npm install" />
    <Exec WorkingDirectory="$(SpaRoot)" Command="npm run build" />
    <ItemGroup>
      <DistFiles Include="$(SpaRoot)dist\**" />
      <ResolvedFileToPublish Include="@(DistFiles->'%(FullPath)')" Exclude="@(ResolvedFileToPublish)">
        <RelativePath>wwwroot\dist\%(RecursiveDir)%(Filename)%(Extension)</RelativePath>
        <CopyToPublishDirectory>PreserveNewest</CopyToPublishDirectory>
      </ResolvedFileToPublish>
    </ItemGroup>
  </Target>
</Project>
```

#### Update Program.cs
```csharp
var builder = WebApplication.CreateBuilder(args);

// Existing services
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ZedCarsContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add SPA services
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/dist";
});

var app = builder.Build();

// Existing middleware
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

// Add SPA static files
app.UseSpaStaticFiles();

// Existing routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// SPA fallback
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    
    if (app.Environment.IsDevelopment())
    {
        spa.UseViteDevServer(npmScript: "dev");
    }
});

app.Run();
```

### 2. Initialize Vite Frontend (1 day)

#### Create ClientApp/package.json
```json
{
  "name": "zedcars-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5173",
    "build": "vite build --outDir dist",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

#### Create ClientApp/vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'https://localhost:5001',
      '/Admin': 'https://localhost:5001',
      '/Account': 'https://localhost:5001',
      '/Home': 'https://localhost:5001'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  }
})
```

### 3. Backend API Integration (2 days)

#### Add API endpoints to existing controllers
```csharp
// HomeController.cs - Add API methods
[Route("api/[controller]")]
public class HomeController : Controller
{
    // Existing MVC actions...

    [HttpGet("vehicles")]
    public async Task<IActionResult> GetVehiclesApi()
    {
        var vehicles = await _carRepository.GetAllCarsAsync();
        return Json(vehicles);
    }

    [HttpGet("vehicles/{id}")]
    public async Task<IActionResult> GetVehicleApi(int id)
    {
        var vehicle = await _carRepository.GetCarByIdAsync(id);
        return Json(vehicle);
    }
}

// AdminController.cs - Add API methods
[Route("api/[controller]")]
public class AdminController : Controller
{
    [HttpGet("dashboard")]
    [Authorize(Roles = "SuperAdmin,Manager")]
    public async Task<IActionResult> GetDashboardApi()
    {
        var stats = new {
            TotalVehicles = await _carRepository.GetTotalVehiclesAsync(),
            TotalSales = await _purchaseRepository.GetTotalSalesAsync(),
            RecentPurchases = await _purchaseRepository.GetRecentPurchasesAsync(5)
        };
        return Json(stats);
    }

    [HttpPost("vehicles")]
    [Authorize(Roles = "SuperAdmin,Manager")]
    public async Task<IActionResult> CreateVehicleApi([FromBody] Car car)
    {
        await _carRepository.AddCarAsync(car);
        return Json(new { success = true, message = "Vehicle added successfully" });
    }
}
```

### 4. JSX Components (10 days)

#### Main App Component
```jsx
// ClientApp/src/App.jsx
import { useState, useEffect } from 'react'
import { Header } from './components/shared/Header'
import { Router } from './components/Router'
import './styles/main.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check authentication status
    fetch('/api/Account/profile', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
  }, [])

  return (
    <div className="app">
      <Header user={user} />
      <Router user={user} />
    </div>
  )
}

export default App
```

#### Vehicle Card Component
```jsx
// ClientApp/src/components/customer/VehicleCard.jsx
export function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <img src={vehicle.imageUrl || '/images/default-car.jpg'} alt={vehicle.model} />
      <div className="vehicle-info">
        <h3>{vehicle.brand} {vehicle.model}</h3>
        <p className="year">{vehicle.year}</p>
        <p className="price">${vehicle.price?.toLocaleString()}</p>
        <button 
          className="btn-primary"
          onClick={() => window.location.href = `/vehicle/${vehicle.id}`}
        >
          View Details
        </button>
      </div>
    </div>
  )
}
```

#### Admin Dashboard
```jsx
// ClientApp/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'

export function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/Admin/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Vehicles</h3>
          <p className="stat-number">{stats.totalVehicles}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-number">${stats.totalSales?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
```

### 5. Routing & Navigation (2 days)

#### Simple Router Component
```jsx
// ClientApp/src/components/Router.jsx
import { HomePage } from '../pages/HomePage'
import { InventoryPage } from '../pages/InventoryPage'
import { AdminDashboard } from '../pages/admin/AdminDashboard'

export function Router({ user }) {
  const path = window.location.pathname

  // Route matching
  if (path === '/' || path === '/home') return <HomePage />
  if (path === '/inventory') return <InventoryPage />
  if (path === '/admin/dashboard' && user?.role === 'SuperAdmin') {
    return <AdminDashboard />
  }
  
  // Fallback to MVC
  window.location.href = path
  return null
}
```

---

## Migration Timeline

| Phase | Task | Duration |
|-------|------|----------|
| **Phase 1** | Project configuration & setup | 1 day |
| **Phase 2** | Vite frontend initialization | 1 day |
| **Phase 3** | Backend API endpoints | 2 days |
| **Phase 4** | Core JSX components | 4 days |
| **Phase 5** | Admin components | 3 days |
| **Phase 6** | Customer components | 3 days |
| **Phase 7** | Routing & navigation | 2 days |
| **Phase 8** | Testing & integration | 2 days |

**Total: 18 days**

---

## Development Workflow

### 1. Start Development
```bash
cd ZedCars.Net8
dotnet run  # Backend on https://localhost:5001

# In another terminal
cd ZedCars.Net8/ClientApp
npm install
npm run dev  # Frontend dev server on http://localhost:5173
```

### 2. Build for Production
```bash
cd ZedCars.Net8/ClientApp
npm run build  # Builds to ClientApp/dist

cd ..
dotnet publish  # Includes built frontend
```

### 3. Route Handling
- **JSX Routes**: Handled by Router component
- **MVC Fallback**: Existing Razor views for complex forms
- **API Endpoints**: Both JSX and MVC can use same endpoints

---

## Advantages

1. **Single Project**: Everything in one solution
2. **Gradual Migration**: Migrate components one by one
3. **Shared Resources**: Use existing images, styles, auth
4. **Hot Reload**: Vite dev server for fast development
5. **Production Ready**: Integrated build process

**Total Integration Time: 18 days**
**Single project deployment with both MVC and JSX capabilities**
