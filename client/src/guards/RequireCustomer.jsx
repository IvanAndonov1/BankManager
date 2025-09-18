import { Outlet } from "react-router";
import RequireRole from "./RequireRole";

export default function RequireCustomer() {
	return (
		<RequireRole roles={["CUSTOMER"]}>
			<Outlet />
		</RequireRole>
	);
}