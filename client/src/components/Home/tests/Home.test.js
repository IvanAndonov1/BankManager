import Home from '../Home';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const renderHome = () =>
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	);

beforeEach(() => {
	renderHome();
});

test('Should render the main heading in the home page', () => {
	const heading = screen.getByText('Redefining how you spend, borrow, and grow');
	expect(heading).toBeInTheDocument();
});