import requester from './requester';

const baseUrl = 'http://localhost:8080/api';

export const loginUser = (data) => requester.post(`${baseUrl}/auth/login`, data);

export const registerUser = (data) => requester.post(`${baseUrl}/auth/register/customer`, data);

export const logoutUser = (token) => requester.post(`${baseUrl}/auth/logout`, {}, { 'Authorization': `Bearer ${token}` });

export const getAllTransactions = (accountId, token) => requester.get(`${baseUrl}/accounts/${accountId}/transactions`, { 'Authorization': `Bearer ${token}` });

export const getUserAccount = (customerId, token) => requester.get(`${baseUrl}/accounts/by-customer/${customerId}`, { 'Authorization': `Bearer ${token}` });

export const getUserDetails = (token, userId) => requester.get(`${baseUrl}/customers/by-id/${userId}`, { 'Authorization': `Bearer ${token}` });
