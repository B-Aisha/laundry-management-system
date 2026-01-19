import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
