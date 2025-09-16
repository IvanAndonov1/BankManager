import requester from './requester';

const baseUrl = 'http://localhost:8080/api';

export const getAllCustomers = (token) => requester.get(`${baseUrl}/customers/all`, { 'Authorization': `Bearer ${token}` });