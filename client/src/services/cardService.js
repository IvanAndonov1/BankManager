export const getAllCardsData = async (token) => {
	return fetch(`https://bankmanager-2.onrender.com/cards/mine`, {
		method: 'GET',
		headers: {
			'authorization': `Bearer ${token}`
		}
	}).then(res => res.json());
}

export const getBalanceData = async (accountNumber, token) => {
	return fetch(`https://bankmanager-2.onrender.com/accounts/${accountNumber}`, {
		method: 'GET',
		headers: {
			'authorization': `Bearer ${token}`
		}
	}).then(res => res.json());
}

export const transferMoneyBetweenCards = (from, data, token) => {
	return fetch(`https://bankmanager-2.onrender.com/accounts/${from}/transfer`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(data)
	});
}