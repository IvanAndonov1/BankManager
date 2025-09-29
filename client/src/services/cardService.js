const baseUrl = import.meta.env.VITE_API_URL;

export const getAllCardsData = async (token) => {
	return fetch(`${baseUrl}/cards/mine`, {
		method: 'GET',
		headers: {
			'authorization': `Bearer ${token}`
		}
	}).then(res => res.json());
}

export const getBalanceData = async (accountNumber, token) => {
	return fetch(`${baseUrl}/accounts/${accountNumber}`, {
		method: 'GET',
		headers: {
			'authorization': `Bearer ${token}`
		}
	}).then(res => res.json());
}

export const transferMoneyBetweenCards = (from, data, token) => {
	return fetch(`${baseUrl}/accounts/${from}/transfer`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(data)
	});
}