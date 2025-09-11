import { createContext } from "react";
import { useStorage } from "../hooks/useStorage.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useStorage('session', {});

	const userLogin = (userData) => setAuth(userData);
	const userLogout = () => setAuth({});

	return (
		<AuthContext.Provider
			value={{
				user: auth,
				userLogin,
				userLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};