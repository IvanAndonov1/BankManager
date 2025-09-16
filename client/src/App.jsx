import { Routes, Route } from 'react-router';
import Loans from './components/Customers/Loans/Loans';
import Transactions from './components/Customers/Transactions/Transactions';
import Dashboard from './components/Customers/Dashboard';


function App() {
	return (
		<>
			<Routes>
				<Route path='/customer-loans' element={<Loans />} />
				<Route path="/customer-dashboard" element={<Dashboard />} />
				<Route path='/customer-transactions' element={<Transactions />} />
				
				
			</Routes>
		</>
	)
}

export default App;