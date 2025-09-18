import { Outlet } from "react-router-dom";
import RequireRole from "./RequireRole";

export default function RequireAdmin() {
	return (
		<RequireRole roles={["ADMIN"]}>
			<Outlet />
		</RequireRole>
	);
}