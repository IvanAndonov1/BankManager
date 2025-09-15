import requester from './requester';

const baseUrl = 'http://localhost:8080/api';

export const loginUser = (data) => requester.post(`${baseUrl}/auth/login`, data);

export const getAllTransactions = (accountId, token) => requester.get(`${baseUrl}/accounts/${accountId}/transactions`, { 'Authorization': `Bearer ${token}` });

export const getUserAccount = (customerId, token) => requester.get(`${baseUrl}/accounts/by-customer/${customerId}`, { 'Authorization': `Bearer ${token}` });
