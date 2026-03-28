import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {

    const tokens = useSelector((state) => state.auth.user);

    return tokens ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;