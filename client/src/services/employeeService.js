import requester from './requester';

const baseUrl = 'http://localhost:8080/api';

export const getAllCustomers = () => requester.get(`${baseUrl}/customers/all`);