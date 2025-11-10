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

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomeIndex />} />
              <Route path="/home" element={<HomeIndex />} />
              {/* For User Login */}
              <Route path="/Auth/Login" element={<Login />} />
              <Route path="/Auth/Register" element={<Register />} />
              {/* Routes accessible to all */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/inventory" element={<HomeInventory />} />
              

              <Route path="/Admin/Dashboard" element={<Dashboard />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  )
}

export default App
