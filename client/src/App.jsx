import { Routes, Route } from 'react-router';
import Dashboard from './components/Employees/Dashboard/Dashboard';
import CustomerMoreInfo from './components/Employees/Customer/Details/Details';


function App() {
	return (
		<>
			<Routes>
				<Route path="/employee" element={<Dashboard />} />
				<Route path="/more-info" element={<CustomerMoreInfo />} />
			</Routes>
		</>
	)
}

export default App;