# Credian – Client (Frontend)

## 🧭 Overview

The **client** is a Single Page Application (SPA) for **Credian**, a digital banking platform with roles for **Customers**, **Employees**, and **Admins**.  

# Credian – Client (Frontend)

## 🧭 Overview

The **client** is a Single Page Application (SPA) for **Credian**, a digital banking platform with roles for **Customers**, **Employees**, and **Admins**.  

It provides functionality for:  
- **Customers**: secure login, account and card management, transfers, loan applications, transaction history.  
- **Employees**: review and approve/decline loan requests, access customer details, manage accounts.  
- **Admins**: oversee employees, monitor analytics dashboards, manage system-wide operations.  

The frontend communicates with the backend via REST API requests (`/api` proxy → `http://localhost:8080`).

---

## 🛠️ Tech Stack

- **React + Vite** – development server & build tool.  
- **React Router v6** – SPA navigation with role-based route protection.  
- **Context API** – global state management for authentication (`AuthContext`).  
- **Tailwind CSS** – utility-first styling.  
- **lucide-react / react-icons** – icons for UI components.  
- **Chart components** – for analytics dashboards.  
- **PDF export** – generate reports directly from analytics/loan data.  
- **Service layer** – API abstraction in `src/services/*`.  

---

## 📁 Project Structure

```text
client/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx                # Entry point (Router, Providers)
   ├─ App.jsx                 # Root layout and route definitions
   ├─ contexts/
   │  └─ AuthContext.jsx      # { user, token, role, login(), logout() }
   ├─ services/
   │  ├─ authService.js       # Authentication (login, register, logout)
   │  ├─ userService.js       # User accounts, transactions
   │  ├─ loanService.js       # Loan quotes and applications
   │  ├─ analyticsService.js  # Analytics data (overview, top declines, cashflow)
   │  ├─ employeeService.js   # Employee actions (approvals, client management)
   ├─ components/
   │  ├─ Dashboard/           # Customer dashboard (balances, transactions)
   │  ├─ Loans/               # Loan modals, loan cards, loan details
   │  ├─ Analytics/           # Analytics overview, charts, PDF export
   │  ├─ Employees/           # Employee table, profile, register modal
   │  ├─ common/              # Shared components (Sidebar, Header, Modal, etc.)
   └─ styles/                 # Tailwind/global CSS
```

---

## 🔑 Core Concepts

- **Authentication**  
  - `AuthContext` stores the user’s token, ID, and role.  
  - Service requests include the token in headers.  
  - Login/Register pages update the context and persist token locally.  

- **Routing & Access Control**  
  - Public routes: login, register.  
  - Private routes: dashboard, transfers, loans.  
  - Role-based access:  
    - Customer → Accounts, Loans, Transfers.  
    - Employee → Loan approvals, Customer details.  
    - Admin → Employee management, Analytics.  

- **API Layer**  
  - Abstracted in `services/*`.  
  - Handles domain-specific logic (users, loans, analytics, employees).  

---

## ▶️ Running the Client

### Prerequisites
- Node.js >= 18  
- Backend running at `http://localhost:8080`  

### Install dependencies
```bash
cd client
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

---

