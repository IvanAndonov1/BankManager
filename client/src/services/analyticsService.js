import requester from './requester';

const baseUrl = import.meta.env.VITE_API_URL;

export const getAnalyticsOverview = (token) =>
	requester.get(`${baseUrl}/staff/analytics/overview`, {
		'Authorization': `Bearer ${token}`,
	});

export const getLoansDisbursedDaily = (token) =>
	requester.get(`${baseUrl}/staff/analytics/loans/disbursed/daily`, {
		'Authorization': `Bearer ${token}`,
	});

export const getLoanDecisionsDaily = (token) =>
	requester.get(`${baseUrl}/staff/analytics/loans/decisions/daily`, {
		'Authorization': `Bearer ${token}`,
	});

export const getTopDeclines = (token) =>
	requester.get(`${baseUrl}/staff/analytics/declines/top`, {
		'Authorization': `Bearer ${token}`,
	});

export const getCashflowDaily = (token) =>
	requester.get(`${baseUrl}/staff/analytics/cashflow/daily`, {
		'Authorization': `Bearer ${token}`,
	});
