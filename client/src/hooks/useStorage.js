import { useState } from "react";

export const useStorage = (key, defaultValue) => {
	const [value, setValue] = useState(() => {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : defaultValue;
	});

	const setStorageData = (newValue) => {
		localStorage.setItem(key, JSON.stringify(newValue));
		setValue(newValue);
	};

	return [value, setStorageData];
};