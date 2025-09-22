import requester from './requester';

const baseUrl = 'http://localhost:8080/api';

export const getAllEmployees = (token) => requester.get(`${baseUrl}/employees/all`, { 'Authorization': `Bearer ${token}` });