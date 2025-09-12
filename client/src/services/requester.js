const requester = {
	get: async (url, headers = {}) => {
		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					...headers
				}
			});

			if (!res.ok) {
				// eslint-disable-next-line no-throw-literal
				throw { message: `Request failed with status: ${res.status}` };
			} else {
				if (!res.url.includes('/logout')) {
					return res.json();
				}
			}
		} catch (err) {
			return err.message;
		}
	},
};