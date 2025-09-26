import { createContext, useEffect, useState } from "react";
import { useStorage } from "../hooks/useStorage.js";
import { getCurrentUser } from "../services/userService.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useStorage('session', {});
	const [data, setData] = useState({});

	const userLogin = (userData) => setAuth(userData);
	const userLogout = () => setAuth({});

	useEffect(() => {
		if (auth?.token && auth.role == 'CUSTOMER' || auth.role == 'EMPLOYEE') {
			getCurrentUser(auth?.token)
				.then(result => setData(result));
		}
	}, [auth?.token])

	return (
		<AuthContext.Provider
			value={{
				user: { ...auth, ...data },
				userLogin,
				userLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};