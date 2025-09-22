import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const roleHome = {
	CUSTOMER: "/customer-dashboard",
	EMPLOYEE: "/employee",
	ADMIN: "/admin",
};

export default function RequireRole({ roles = [] }) {
	const { user } = useContext(AuthContext);

	if (!user?.token) {
		return <Navigate to="/login" replace />;
	}

	if (!roles.includes(user.role)) {
		const dest = roleHome[user.role] ?? "/";
		return <Navigate to={dest} replace />;
	}

	return <Outlet />;
}
