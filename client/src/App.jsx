import { Routes, Route } from 'react-router';
import Dashboard from './components/Employees/Dashboard/Dashboard';
import CustomerMoreInfo from './components/Employees/Customer/Details/Details';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';


function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/employee" element={<Dashboard />} />
				<Route path="/customer-details/:employeeId" element={<CustomerMoreInfo />} />
			</Routes>
		</>
	)
}

export default App;