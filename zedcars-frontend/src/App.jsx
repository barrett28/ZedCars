import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/HTML/Navbar'
import Dashboard from './pages/Admin/HTML/Dashboard'
import Login from './pages/Auth/HTML/Login'
import HomeIndex from "./pages/Home/HTML/Index"
import Footer from './components/layout/HTML/Footer'          // Footer 1
import Footer2 from './components/layout/HTML/Footer2'        // Footer 2
import Contact from './pages/Home/HTML/Contact'
import About from './pages/Home/HTML/About'
import Register from './pages/Auth/HTML/Register'
import HomeInventory from './pages/Home/HTML/HomeInventory'
import { AuthProvider } from './context/AuthContext'
import VehicleDetail from "./pages/Home/HTML/VehicleDetail"
import MyTestDrives from './pages/Home/HTML/MyTestDrives'
import AdminInventory from './pages/Admin/HTML/AdminInventory'
import AddVehicle from './pages/Admin/HTML/AddVehicle'
import EditVehicle from './pages/Admin/HTML/EditVehicle'
import DeleteVehicle from './pages/Admin/HTML/DeleteVehicle'
import Purchase from './pages/Home/HTML/Purchase'
import MyPurchases from './pages/Home/HTML/MyPurchases'
import PurchaseAccessories from './pages/Home/HTML/PurchaseAccessories'
import ManageAccessories from './pages/Admin/HTML/ManageAccessories'
import EditAccessories from './pages/Admin/HTML/EditAccessories'
import AddAccessory from './pages/Admin/HTML/AddAccessory'
import AddUser from './pages/Admin/HTML/Users/AddUser'
import ManageUsers from './pages/Admin/HTML/Users/ManageUsers'
import EditUser from './pages/Admin/HTML/Users/EditUser'
import Reports from './pages/Admin/HTML/Reports'
import TestDrives from './pages/Admin/HTML/TestDrives'
import Dashboard2 from './pages/Admin/HTML/Dashboard2'
import UserActivity from './pages/Admin/HTML/UserActivity'
import Addon from './pages/Home/HTML/Addon'
import Profile from './pages/Profile/HTML/Profile'


function AppContent() {
  const location = useLocation();

  // Landing page check → HomeIndex.jsx
  const isLandingPage =
    location.pathname === "/" || location.pathname === "/home";

  return (
    <>
      <Navbar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomeIndex />} />
          <Route path="/home" element={<HomeIndex />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/Auth/Login" element={<Login />} />
          <Route path="/Auth/Register" element={<Register />} />

          {/* Customer Routes */}
          <Route path="/inventory" element={<HomeInventory />} />
          <Route path="/purchase/:id" element={<Purchase />} />
          <Route path='/my-purchases' element={<MyPurchases />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/my-testdrives" element={<MyTestDrives />} />
          <Route path="/purchaseaccessories" element={<PurchaseAccessories />} />
          <Route path='/addon' element={<Addon />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin */}
          <Route path="/Admin/Dashboard" element={<Dashboard />} />
          <Route path="/Admin/AdminInventory" element={<AdminInventory />} />
          <Route path="/Admin/AddVehicle" element={<AddVehicle />} />
          <Route path="/Admin/EditVehicle/:id" element={<EditVehicle />} />
          <Route path="/Admin/DeleteVehicle/:id" element={<DeleteVehicle />} />
          <Route path="/Admin/ManageAccessories" element={<ManageAccessories />} />
          <Route path="/Admin/EditAccessories/:id" element={<EditAccessories />} />
          <Route path="/Admin/AddAccessory" element={<AddAccessory />} />
          <Route path="/Admin/Reports" element={<Reports />} />
          <Route path="/Admin/test-drives" element={<TestDrives />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/Admin/UserActivity" element={<UserActivity />} />

          {/* Super Admin */}
          <Route path="/Admin/Users" element={<ManageUsers />} />
          <Route path="/Admin/Users/Add" element={<AddUser />} />
          <Route path="/Admin/Users/Edit/:id" element={<EditUser />} />
        </Routes>

        {/* Footer 2 (ONLY visible on landing pages) */}
        {isLandingPage ? <Footer2 /> : <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
