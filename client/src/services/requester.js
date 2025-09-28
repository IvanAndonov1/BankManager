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
	post: async (url, data = {}, headers = {}) => {
		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...headers
				},
				body: JSON.stringify(data)
			});

			if (!res.ok) {
				throw new Error(`Request failed with status: ${res.status}`);
			} else {
				if (res.url.includes('download') || res.headers.get('content-disposition')) {
					return await res.blob();
				}
				if (res.status === 204 || res.status === 205) {
					return null;
				}
				const ct = res.headers.get('content-type') || '';
				if (ct.includes('application/json')) {
					return await res.json();
				}
				return await res.text();
			}
		} catch (err) {
			return err;
		}
	},
	put: async (url, headers = {}, data = {}) => {
		try {
			const res = await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					...headers
				},
				body: JSON.stringify(data)
			});

			if (!res.ok) {
				throw new Error(`Request failed with status: ${res.status}`);
			} else {
				return res.json();
			}
		} catch (err) {
			return err;
		}
	},
	delete: async (url, headers = {}) => {
		try {
			const res = await fetch(url, {
				method: 'DELETE',
				headers: {
					...headers
				}
			});

			if (!res.ok) {
				throw new Error(`Request failed with status: ${res.status}`);
			} else {
				return res.json();
			}
		} catch (err) {
			return err;
		}
	},
	patch: async (url, headers = {}, data = {}) => {
		try {
			const res = await fetch(url, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					...headers
				},
				body: JSON.stringify(data)
			});

			if (!res.ok) {
				throw new Error(`Request failed with status: ${res.status}`);
			} else {
				return res.json();
			}
		} catch (err) {
			return err;
		}

	}
};

export default requester;