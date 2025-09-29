import requester from './requester';

const baseUrl = 'https://bankmanager-2.onrender.com';

export const getAllEmployees = (token) => requester.get(`${baseUrl}/employees/all`, { 'Authorization': `Bearer ${token}` });

export const getEmployeeById = (employeeId, token) => requester.get(`${baseUrl}/employees/by-id/${employeeId}`, { 'Authorization': `Bearer ${token}` });

export const editEmployeeInformation = (employeeId, token, data) => requester.put(`${baseUrl}/employees/${employeeId}`, { 'Authorization': `Bearer ${token}` }, data);

export const promoteEmployee = (employeeId, token) => requester.put(`${baseUrl}/employees/${employeeId}/promote`, { 'Authorization': `Bearer ${token}` }, {});

export const fireEmployee = (employeeId, token) => requester.put(`${baseUrl}/employees/${employeeId}/fire`, { 'Authorization': `Bearer ${token}` }, {});

export const registerEmployee = (token, data) => requester.post(`${baseUrl}/auth/register/employee`, data, { 'Authorization': `Bearer ${token}` });

export const getAIApplicationForecast = (token) => requester.get(`http://localhost:8080/api/staff/analytics/ai/forecast`, { 'Authorization': `Bearer ${token}` });
