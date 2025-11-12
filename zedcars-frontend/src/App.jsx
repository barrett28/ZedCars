import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/HTML/Navbar'
import Dashboard from './pages/Admin/HTML/Dashboard'
import Login from './pages/Auth/HTML/Login'
import HomeIndex from "./pages/Home/HTML/Index"
import Footer from './components/layout/HTML/Footer'
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

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Routes accessible to all */}
              <Route path="/" element={<HomeIndex />} />
              <Route path="/home" element={<HomeIndex />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* For User Login */}
              <Route path="/Auth/Login" element={<Login />} />
              <Route path="/Auth/Register" element={<Register />} />
              
              {/* Routes accessible to Home */}
              <Route path="/inventory" element={<HomeInventory />} />
              <Route path="/purchase/:id" element={<Purchase />} />
              <Route path='/my-purchases' element={<MyPurchases />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
              <Route path="/my-testdrives" element={<MyTestDrives />} />
              <Route path="/purchaseaccessories" element={<PurchaseAccessories />} />

              {/* Routes are for Admin  */}
              <Route path="/Admin/Dashboard" element={<Dashboard />} />
              <Route path="/Admin/AdminInventory" element={<AdminInventory />} />
              <Route path="/Admin/AddVehicle" element={<AddVehicle />} />
              <Route path="/Admin/EditVehicle/:id" element={<EditVehicle />} />
              <Route path="/Admin/DeleteVehicle/:id" element={<DeleteVehicle />} />
              <Route path="/Admin/ManageAccessories" element={<ManageAccessories />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  )
}

export default App
