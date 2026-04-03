import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";

import PrivateRoutes from "./context/PrivateRoutes";
import { updateToken } from "./utils/auth";
import ForgotPasswordPage from "./pages/ForgotPassword";
import Test from "./pages/Test";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import BusinessPage from "./pages/BusinessPage";


function AppContent() {
  const dispatch = useDispatch();
  const tokens = useSelector((state) => state.auth.tokens);
  const location = useLocation(); // add this
  const [isProvider, setIsProvider] = useState(false)

  // add this
  const hideHeaderRoutes = ["/login", "/register", "/forgot_password", ];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  const navItems = [
    { name: "Explore", path: "/" },
    { name: "Bookings", path: "/bookings" },
    {name : "Profile", path: "/profile"}
  ];  

  useEffect(() => {
    if (!tokens) return;
    const interval = setInterval(() => {
      updateToken(dispatch);
    }, 600000);
    return () => clearInterval(interval);
  }, [tokens]);

  return (
    <>
      {showHeader && <Header navItems={navItems} isProvider = {isProvider} />}  
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotPasswordPage />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/business/:id" element={<BusinessPage />} />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </>
  );
}


export default function App() {
  return (
    <Router>  
      <AppContent />
    </Router>
  );
}