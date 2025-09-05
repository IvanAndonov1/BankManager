import { Routes, Route } from 'react-router';
import Dashboard from './components/Employees/Dashboard/Dashboard';

function App() {
	return (
		<>
			<Routes>
				<Route path="/employee" element={<Dashboard />} />
			</Routes>
		</>
	)
}

export default App;