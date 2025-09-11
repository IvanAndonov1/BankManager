# BankManager
An app that allows banks to acess clients for loans.

    1) Backend Proxy
Във client/vite.config.js имаме прокси /api към бекенда:

server: {
proxy: {
"/api": { target: "http://localhost:8080", changeOrigin: true }
}
}

---
    2) Основни ендпойнтове
---
   Сметки (Accounts)

GET /api/accounts/by-customer/{id} – всички сметки на клиент.

POST /api/accounts/deposit – внасяне по сметка.

POST /api/accounts/withdraw – теглене от сметка.

POST /api/accounts/transfer – превод между сметки.

Кредити (Loans)

POST /api/loans/applications – създава кредитна заявка.

POST /api/loans/applications/{id}/evaluate – оценка на кредитната заявка (връща статус и резултат).

GET /api/loans/{id} – връща данни за заявка.

---
    3) Примери

    3.1 Сметки
---

GET /api/accounts/by-customer/1

[
{
"id": 1,
"customerId": 1,
"accountNumber": "BG80BNBG96611020345678",
"balance": 1000.00
}
]


POST /api/accounts/deposit

{ "accountId": 1, "amount": 100.00, "description": "Заплата" }


Отговор: 204 No Content

---
    3.2 Кредити
---

POST /api/loans/applications

{
"customerId": 1,
"productType": "CONSUMER",
"requestedAmount": 5000,
"termMonths": 24,
"employerStartDate": "2024-01-01",
"netSalary": 2500
}


Отговор:

{ "id": 123 }


POST /api/loans/applications/123/evaluate
Отговор:

{
"status": "APPROVED",
"reasons": [],
"tenureScore": 80,
"dtiScore": 100,
"incomeScore": 60,
"accountAgeScore": 20,
"cushionScore": 80,
"recentDebtScore": 60,
"composite": 76
}


GET /api/loans/123

{
"id": 123,
"customerId": 1,
"productType": "CONSUMER",
"requestedAmount": 5000,
"termMonths": 24,
"status": "APPROVED",
"score": 76,
"reasons": []
}

