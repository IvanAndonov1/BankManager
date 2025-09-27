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

