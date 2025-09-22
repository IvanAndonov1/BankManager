import { use, useEffect } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext";
import { logoutUser } from "../../../services/userService";

function Logout() {
	const { userLogout, user } = use(AuthContext);

	useEffect(() => {
		logoutUser(user.token)
			.then(() => userLogout());
	}, [user.token]);

	return <Navigate to="/" />
}

export default Logout;