import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import Users from "./pages/admin/Users";
import Staff from "./pages/admin/Staff";
import CreateStaff from "./pages/admin/CreateStaff";
import AdminOrders from "./pages/admin/AdminOrders";
import ManageServices from "./pages/admin/ManageServices";
import AdminReports from "./pages/admin/AdminReports";


import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffHome from "./pages/staff/StaffHome";
import StaffOrders from "./pages/staff/StaffOrders";


import CustomerDashboard from "./pages/customer/CustomerDashboard";
import NewOrder from "./pages/customer/NewOrder";
import CustomerHome from "./pages/customer/CustomerHome";
import MyOrders from "./pages/customer/MyOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<Users />} />
          <Route path="staff" element={<Staff />} />
          <Route path="create-staff" element={<CreateStaff />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        <Route path="/staff" element={<StaffDashboard />}>
          <Route index element={<StaffHome />} />
          <Route path="orders" element={<StaffOrders />} />
        </Route>


        <Route path="/customer" element={<CustomerDashboard />}>
        <Route index element={<CustomerHome />} />
        <Route path="new-order" element={<NewOrder />} />
        <Route path="orders" element={<MyOrders />} />
      </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;