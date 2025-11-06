
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Admin/HTML/Dashboard'
import Login from './pages/Auth/HTML/Login'
import HomeIndex from "./pages/Home/HTML/Index"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeIndex />} />
        <Route path="/home" element={<HomeIndex />} />
        <Route path="/Auth/Login" element={<Login />} />
        <Route path="/Admin/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
