import { Outlet } from "react-router";
import RequireRole from "./RequireRole";

export default function RequireEmployee() {
	return (
		<RequireRole roles={["EMPLOYEE"]}>
			<Outlet />
		</RequireRole>
	);
}