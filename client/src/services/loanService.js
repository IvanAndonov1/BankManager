import requester from "./requester";
const baseUrl = "https://bankmanager-2.onrender.com";

export const getLoanQuote = (loanData, token) =>
	requester.get(`${baseUrl}/loans/quote?requestedAmount=${loanData.requestedAmount}&termMonths=${loanData.termMonths}`,
		{ 'Authorization': `Bearer ${token}` });

export const submitLoanApplication = (loanData, token) =>
	requester.post(`${baseUrl}/loans/applications`, loanData, { 'Authorization': `Bearer ${token}` });

export const getLoanApplications = (token) =>
	requester.get(`${baseUrl}/loans/applications/mine`, { 'Authorization': `Bearer ${token}` });

export const getLoanFeedback = (token, loanId) =>
	requester.get(`http://localhost:8080/api/loans/feedback/${loanId}`, { 'Authorization': `Bearer ${token}` });