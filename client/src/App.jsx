import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SwappableSlots from "./pages/SwappableSlots";
import SwapResponse from "./pages/SwapResponse";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/swappable" element={<SwappableSlots />} />
        <Route path="/swap-response" element={<SwapResponse />} />
      </Routes>
    </Router>
  );
}
