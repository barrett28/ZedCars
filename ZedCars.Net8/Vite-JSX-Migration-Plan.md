# ZedCars Vite JSX Migration Plan
**Frontend Migration: MVC Views → Vite + JSX (Keep existing .NET 8 MVC Backend)**

## Overview
Convert existing Razor views to Vite + JSX frontend while keeping the current .NET 8 MVC controllers as API endpoints.

## Architecture
- **Backend**: Existing .NET 8 MVC (minimal changes)
- **Frontend**: Vite + JSX + Vanilla JS/TypeScript
- **Communication**: Fetch API calls to existing MVC controllers
- **Authentication**: Keep existing cookie authentication

---

## Backend Changes (2 days)

### Modify Existing Controllers for API Support
```csharp
// Add [ApiController] attribute and JSON responses
[ApiController]
public class HomeController : Controller
{
    // Keep existing methods, add API endpoints
    [HttpGet("api/vehicles")]
    public async Task<IActionResult> GetVehiclesApi()
    {
        var vehicles = await _carRepository.GetAllCarsAsync();
        return Json(vehicles);
    }
}
```

### Required Backend Modifications
| Controller | Changes | Time |
|------------|---------|------|
| **HomeController** | Add JSON endpoints for vehicles, inventory | 0.5 days |
| **AdminController** | Add JSON responses for dashboard, CRUD | 0.5 days |
| **AccountController** | Add JSON login/logout endpoints | 0.5 days |
| **ReportsController** | Add JSON data endpoints | 0.5 days |

**Total Backend: 2 days**

---

## Frontend Migration (Vite + JSX)

### Project Setup (1 day)
```bash
npm create vite@latest zedcars-frontend -- --template vanilla
cd zedcars-frontend
npm install axios
```

### 1. Authentication Module (2 days)
**Files:**
- `src/components/LoginForm.jsx`
- `src/components/AuthGuard.jsx`
- `src/utils/auth.js`

### 2. Layout Components (1 day)
**Files:**
- `src/components/Header.jsx`
- `src/components/Navigation.jsx`
- `src/components/Layout.jsx`

### 3. Public Pages (3 days)
**Files:**
- `src/pages/HomePage.jsx`
- `src/pages/InventoryPage.jsx`
- `src/pages/VehicleDetailPage.jsx`
- `src/pages/AboutPage.jsx`
- `src/pages/ContactPage.jsx`
- `src/components/VehicleCard.jsx`
- `src/components/SearchFilters.jsx`

### 4. Customer Module (2 days)
**Files:**
- `src/pages/PurchasePage.jsx`
- `src/pages/MyPurchasesPage.jsx`
- `src/components/PurchaseForm.jsx`

### 5. Admin Module (4 days)
**Files:**
- `src/pages/admin/Dashboard.jsx`
- `src/pages/admin/VehicleManagement.jsx`
- `src/pages/admin/AddVehicle.jsx`
- `src/pages/admin/EditVehicle.jsx`
- `src/pages/admin/Reports.jsx`
- `src/components/admin/VehicleTable.jsx`
- `src/components/admin/DashboardStats.jsx`

### 6. Shared Components (1 day)
**Files:**
- `src/components/Button.jsx`
- `src/components/Modal.jsx`
- `src/components/Loading.jsx`

**Total Frontend: 14 days**

---

## File Structure

```
ZedCars.Net8/                        # Existing MVC Backend
├── Controllers/                     # Keep existing (add JSON endpoints)
├── Views/                          # Keep for fallback
├── Services/                       # Keep existing
└── wwwroot/                        # Static files

zedcars-frontend/                    # New Vite Frontend
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── AuthGuard.jsx
│   │   ├── admin/
│   │   │   ├── VehicleTable.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   └── VehicleForm.jsx
│   │   ├── customer/
│   │   │   ├── VehicleCard.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   └── PurchaseForm.jsx
│   │   └── shared/
│   │       ├── Header.jsx
│   │       ├── Navigation.jsx
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       └── Loading.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── VehicleDetailPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── PurchasePage.jsx
│   │   ├── MyPurchasesPage.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── VehicleManagement.jsx
│   │       ├── AddVehicle.jsx
│   │       ├── EditVehicle.jsx
│   │       └── Reports.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── vehicleService.js
│   │   ├── authService.js
│   │   └── adminService.js
│   ├── utils/
│   │   ├── auth.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── styles/
│   │   ├── main.css
│   │   └── components.css
│   ├── main.jsx
│   └── App.jsx
├── package.json
└── vite.config.js
```

---

## API Integration

### Service Layer (JSX Frontend)
```javascript
// src/services/api.js
const API_BASE = 'https://localhost:5001';

export const api = {
  get: (url) => fetch(`${API_BASE}${url}`, { credentials: 'include' }),
  post: (url, data) => fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })
};

// src/services/vehicleService.js
export const vehicleService = {
  getAll: () => api.get('/api/vehicles'),
  getById: (id) => api.get(`/api/vehicles/${id}`),
  create: (vehicle) => api.post('/Admin/AddVehicle', vehicle),
  update: (id, vehicle) => api.post(`/Admin/EditVehicle/${id}`, vehicle),
  delete: (id) => api.post(`/Admin/DeleteVehicle/${id}`)
};
```

### Backend Controller Updates
```csharp
// HomeController.cs - Add API endpoints
[HttpGet("api/vehicles")]
public async Task<IActionResult> GetVehiclesApi()
{
    var vehicles = await _carRepository.GetAllCarsAsync();
    return Json(vehicles);
}

[HttpGet("api/vehicles/{id}")]
public async Task<IActionResult> GetVehicleApi(int id)
{
    var vehicle = await _carRepository.GetCarByIdAsync(id);
    return Json(vehicle);
}

// AdminController.cs - Add JSON responses
[HttpGet("api/admin/dashboard")]
public async Task<IActionResult> GetDashboardDataApi()
{
    var stats = await GetDashboardStats();
    return Json(stats);
}

[HttpPost("api/admin/vehicles")]
public async Task<IActionResult> CreateVehicleApi([FromBody] Car car)
{
    await _carRepository.AddCarAsync(car);
    return Json(new { success = true });
}
```

---

## Component Examples

### Vehicle Card Component
```jsx
// src/components/customer/VehicleCard.jsx
export function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <img src={vehicle.imageUrl} alt={vehicle.model} />
      <h3>{vehicle.brand} {vehicle.model}</h3>
      <p className="price">${vehicle.price}</p>
      <button onClick={() => window.location.href = `/vehicle/${vehicle.id}`}>
        View Details
      </button>
    </div>
  );
}
```

### Admin Dashboard
```jsx
// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';

export function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.getDashboardStats()
      .then(data => setStats(data));
  }, []);

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Vehicles</h3>
            <p>{stats.totalVehicles}</p>
          </div>
          <div className="stat-card">
            <h3>Total Sales</h3>
            <p>${stats.totalSales}</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Migration Timeline

| Phase | Task | Duration | 
|-------|------|----------|
| **Phase 1** | Backend API endpoints | 2 days |
| **Phase 2** | Vite project setup | 1 day |
| **Phase 3** | Authentication & Layout | 3 days |
| **Phase 4** | Public pages | 3 days |
| **Phase 5** | Customer module | 2 days |
| **Phase 6** | Admin module | 4 days |
| **Phase 7** | Testing & integration | 2 days |

**Total: 17 days (3.5 weeks)**

---

## Development Setup

### 1. Backend (Existing MVC)
```bash
cd ZedCars.Net8
dotnet run  # Runs on https://localhost:5001
```

### 2. Frontend (New Vite)
```bash
cd zedcars-frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### 3. Vite Configuration
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': 'https://localhost:5001',
      '/Admin': 'https://localhost:5001',
      '/Account': 'https://localhost:5001'
    }
  }
}
```

---

## Advantages of This Approach

### Benefits
- **Minimal Backend Changes**: Keep existing business logic
- **Faster Migration**: No need to rewrite controllers
- **Gradual Migration**: Can migrate page by page
- **Existing Authentication**: Keep cookie-based auth
- **Database Intact**: No data migration needed

### Considerations
- **CORS Setup**: Configure CORS for cross-origin requests
- **Session Management**: Handle cookie authentication in JSX
- **File Uploads**: Maintain existing image upload logic
- **SEO**: Consider SSR if needed later

---

## Technology Stack

### Frontend
- **Vite** - Fast build tool
- **JSX** - Component syntax
- **Vanilla JS/TypeScript** - No framework overhead
- **CSS3** - Modern styling
- **Fetch API** - HTTP requests

### Backend (Unchanged)
- **.NET 8 MVC**
- **Entity Framework Core**
- **MySQL Database**
- **Cookie Authentication**

**Total Migration Time: 17 days**
**Recommended Team: 1-2 developers**
