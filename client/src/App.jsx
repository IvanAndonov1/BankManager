import { Routes, Route } from 'react-router';
import Dashboard from './components/Employees/Dashboard/Dashboard';
import CustomerMoreInfo from './components/Employees/Customer/Details/Details';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';
import AdminDashboard from './components/Admin/Dashboard/Dashboard';
import AdminEmployeeDetails from './components/Admin/Employee/Details/AdminEmployeeDetails';


function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/employee" element={<Dashboard />} />
				<Route path="/customer-details/:employeeId" element={<CustomerMoreInfo />} />
				<Route path="/admin" element={<AdminDashboard />} />
				<Route path="/admin/employee/:employeeId" element={<AdminEmployeeDetails />} />
			</Routes>
		</>
	)
}

export default App;