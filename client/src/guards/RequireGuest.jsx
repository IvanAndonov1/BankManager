import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const roleHome = {
	CUSTOMER: "/customer-dashboard",
	EMPLOYEE: "/employee",
	ADMIN: "/admin",
};

export default function RequireGuest() {
	const { user } = useContext(AuthContext);

	if (user?.id) {
		const dest = roleHome[user.role] ?? "/";
		return <Navigate to={dest} replace />;
	}

	return <Outlet />;
}
