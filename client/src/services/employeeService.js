import requester from './requester';

const baseUrl = 'https://bankmanager-2.onrender.com/api';

export const getAllCustomers = (token) => requester.get(`${baseUrl}/customers/all`, { 'Authorization': `Bearer ${token}` });

export const getAllLoanDetails = (token, userId) => requester.get(`${baseUrl}/loans/applications?customerId=${userId}`, { 'Authorization': `Bearer ${token}` });

export const approveCreditHandler = (creditId, token, data) => requester.post(`${baseUrl}/loans/applications/${creditId}/decision`, data, { 'Authorization': `Bearer ${token}` });

export const declineCreditHandler = (creditId, token, data) => requester.post(`${baseUrl}/loans/applications/${creditId}/decision`, data, { 'Authorization': `Bearer ${token}` });

export const editCustomerInfo = (customerId, token, data) => requester.put(`${baseUrl}/customers/${customerId}`, { 'Authorization': `Bearer ${token}` }, data);