import requester from './requester';

const baseUrl = 'http://localhost:8080/api/staff/analytics';

export const getAnalyticsOverview = (token) =>
	requester.get(`${baseUrl}/overview`, {
		'Authorization': `Bearer ${token}`,
	});

export const getLoansDisbursedDaily = (token) =>
	requester.get(`${baseUrl}/loans/disbursed/daily`, {
		'Authorization': `Bearer ${token}`,
	});

export const getLoanDecisionsDaily = (token) =>
	requester.get(`${baseUrl}/loans/decisions/daily`, {
		'Authorization': `Bearer ${token}`,
	});

export const getTopDeclines = (token) =>
	requester.get(`${baseUrl}/declines/top`, {
		'Authorization': `Bearer ${token}`,
	});

export const getCashflowDaily = (token) =>
	requester.get(`${baseUrl}/cashflow/daily`, {
		'Authorization': `Bearer ${token}`,
	});
