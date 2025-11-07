import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/HTML/Navbar'
import Dashboard from './pages/Admin/HTML/Dashboard'
import Login from './pages/Auth/HTML/Login'
import HomeIndex from "./pages/Home/HTML/Index"
import Footer from './components/layout/HTML/Footer'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeIndex />} />
            <Route path="/home" element={<HomeIndex />} />
            <Route path="/Auth/Login" element={<Login />} />
            <Route path="/Admin/Dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App
