import { Routes, Route } from 'react-router';

import Loans from './components/Customers/Loans';
import Transactions from './components/Customers/Transactions';
import Dashboard from './components/Customers/Dashboard';

import CustomerMoreInfo from './components/Employees/Customer/Details/Details';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';
import AdminDashboard from './components/Admin/Dashboard/Dashboard';
import AdminEmployeeDetails from './components/Admin/Employee/Details/AdminEmployeeDetails';
import Register from './components/Auth/Register/Register';
import EmployeeDashboard from './components/Employees/Dashboard/Dashboard';
import { AuthProvider } from './contexts/AuthContext.jsx';



function App() {
	return (
		<>
			<AuthProvider>
				<Routes>
					<Route path='/customer-loans' element={<Loans />} />
					<Route path="/customer-dashboard" element={<Dashboard />} />
					<Route path='/customer-transactions' element={<Transactions />} />

					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/employee" element={<EmployeeDashboard />} />
					<Route path="/customer-details/:employeeId" element={<CustomerMoreInfo />} />
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/admin/employee/:employeeId" element={<AdminEmployeeDetails />} />
				</Routes>
			</AuthProvider>
		</>
	)
}

export default App;