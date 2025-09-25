import requester from './requester';

const baseUrl = 'http://localhost:8080/api';

export const getAllEmployees = (token) => requester.get(`${baseUrl}/employees/all`, { 'Authorization': `Bearer ${token}` });

export const getEmployeeById = (employeeId, token) => requester.get(`${baseUrl}/employees/by-id/${employeeId}`, { 'Authorization': `Bearer ${token}` });

export const editEmployeeInformation = (employeeId, token, data) => requester.put(`${baseUrl}/employees/${employeeId}`, { 'Authorization': `Bearer ${token}` }, data);

export const promoteEmployee = (employeeId, token) => requester.put(`${baseUrl}/employees/${employeeId}/promote`, { 'Authorization': `Bearer ${token}` }, {});

export const fireEmployee = (employeeId, token) => requester.put(`${baseUrl}/employees/${employeeId}/fire`, { 'Authorization': `Bearer ${token}` }, {});
