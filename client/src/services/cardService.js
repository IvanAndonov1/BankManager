export const getAllCardsData = async (accountNumber, token) => fetch(`http://localhost:8080/api/by-account/${accountNumber}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${token}`
            }
        }); 

export const getBalanceData = async (customerId, token) => fetch(`http://localhost:8080/api/accounts/by-customer/${customerId}`, {
				method: 'GET',
				headers: {
					'authorization': `Bearer ${token}`
				}
			}); 