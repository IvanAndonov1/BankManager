import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function RequireAuth() {
	const { user } = useContext(AuthContext);
	const loc = useLocation();

	if (!user?.token) {
		return <Navigate to="/login" replace state={{ from: loc }} />;
	}

	return <Outlet />;
}