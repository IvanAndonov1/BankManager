export const getAllCardsData = async (token) => {
	return fetch(`http://localhost:8080/api/cards/mine`, {
		method: 'GET',
		headers: {
			'authorization': `Bearer ${token}`
		}
	});
}

export const getBalanceData = async (accountNumber, token) => {
	return fetch(`http://localhost:8080/api/accounts/${accountNumber}`, {
		method: 'GET',
		headers: {
			'authorization': `Bearer ${token}`
		}
	});
}