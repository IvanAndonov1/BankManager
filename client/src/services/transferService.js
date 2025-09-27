import requester from "./requester";

const baseUrl = "https://bankmanager-2.onrender.com/api";

export const makeTransfer = (fromAccountNumber, token, data) => {
  return requester.post(
    `${baseUrl}/accounts/${fromAccountNumber}/transfer`,
    data,
    { Authorization: `Bearer ${token}` }
  );
};

export const depositMoney = (accountNumber, token, amount, description = "Deposit") =>
    requester.post(
        `${baseUrl}/accounts/${accountNumber}/deposit`,
        { amount, description },
        { 'Authorization': `Bearer ${token}` }
    );

export const withdrawMoney = (accountNumber, token, amount, description = "Withdraw") =>
    requester.post(
        `${baseUrl}/accounts/${accountNumber}/withdraw`,
        { amount, description },
        { 'Authorization': `Bearer ${token}` }
    );
