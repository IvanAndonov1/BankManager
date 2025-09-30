# Credian — BankManager 

## 🚀 Capabilities

This application implements a full banking workflow with role-based features and admin controls. Highlights:

- Users & Roles
	- Customers: create accounts, view balances, request/manage multiple cards, initiate transfers, apply for loans, view transaction history.
	- Employees: view customer details, review and process loan applications, assist with account issues and transaction investigations.
	- Admins: manage (promote/demote) employees, configure system settings, review analytics and generate reports, and perform high-level user management.

- Accounts & Cards
	- Support for multiple cards per customer (debit/credit-like card representations).

- Loans
	- Customers can request loans via form (amount, term, income, account age). Loan requests are routed to employees for review.
	- Employees can approve/decline based on the information given by the user an AI or request more info.
	- Loan lifecycle records are stored and available via the UI and API.

- Transfers & Transactions
	- Transfers between personal accounts or to another user; transaction history.
	- Transaction details can be exported or printed (PDF export available in analytics/features).

- Analytics & Reporting
	- Admin-facing dashboards with loan statistics, cashflow trends, top decline reasons and other KPIs.
	- Exportable PDF reports for analytics views.

- Notifications & Security
	- Email notifications (SMTP) for account events and loan updates.
    - Option to reset password with email confirmation
	- JWT-based authentication and role-based route protection across client and server.

## 🧾 Simple overview

This repository contains the Credian banking application split into two main parts:

- `client/` — React + Vite Single Page Application (frontend). See `client/README.md` for details.
- `server/` — Spring Boot backend (Java 21, Maven) exposing REST APIs, auth, and business logic. See `server/README.md` for details.

The client communicates with the backend via a REST API (default: http://localhost:8080).

---



## 🛠️ Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Java 21, Spring Boot (Web, Security, Data JPA, Flyway, Mail), JWT, Caffeine
- Database: PostgreSQL (Flyway migrations)
- Tooling: Maven, npm, OpenAPI (springdoc)

---

## ▶️ Quickstart (development)

Prerequisites:

- Node.js (>= 18)
- Java 21 (JDK)
- Maven
- A PostgreSQL database for the server (or point to a hosted DB)

Start the backend first, then the frontend. From the repo root:

```powershell
cd server
mvn clean spring-boot:run

# in a second terminal
cd client
npm install
npm run dev
```

Notes:

- Configure DB, JWT secret and SMTP credentials for the server via environment variables or `src/main/resources/application.properties` (do not commit real secrets). The server `target/classes/application.properties` currently contains development/example values.
- The frontend expects the API at `http://localhost:8080` during development. Adjust client proxy or server.port if needed.

---

## 📁 Project layout

```text
BankManager/
├─ client/    # frontend (React + Vite)
├─ server/    # backend (Spring Boot, Java 21, Maven)
├─ README.md  # this file
```




---
## 🧭 Where to go next

- Read `client/README.md` for frontend details and running the SPA.
- Read `server/README.md` for backend configuration, running tests
- Hosted on `https://credian.onrender.com/`

## 🤖 Contributors

- Martin Sofroniev [LinkedIn](https://www.linkedin.com/in/martinsofroniev/)
- Ivan Andonov [LinkedIn](https://www.linkedin.com/in/ivan-andonov-77aa55182/)
- Zhozemir Kushev [LinkedIn](https://www.linkedin.com/in/zhozemir-kushev-92bba532b/)
- Ina Mihaylova [LinkedIn](https://www.linkedin.com/in/ina-mihaylova/)
- Nikolay Frunze [LinkedIn](https://www.linkedin.com/in/nikolay-frunze)
