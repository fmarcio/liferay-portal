import React from 'react';
import {createMemoryHistory} from 'history';
import {render} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {useClampedPage} from 'shared/hooks/useClampedPage';

jest.unmock('react-dom');

const TestComponent = props => {
	useClampedPage(props);

	return null;
};

const renderHook = props => {
	const history = createMemoryHistory({
		initialEntries: ['/workspace/23/123/contacts/segments']
	});

	const push = jest.fn();

	history.push = push;

	render(
		<Router history={history}>
			<TestComponent {...props} />
		</Router>
	);

	return push;
};

describe('useClampedPage', () => {
	it('should redirect to the last valid page when the page is out of range', () => {
		const push = renderHook({
			delta: 20,
			loading: false,
			page: 2,
			total: 3
		});

		expect(push).toHaveBeenCalledWith(expect.stringContaining('page=1'));
	});

	it('should clamp to the last page that contains results', () => {
		const push = renderHook({
			delta: 2,
			loading: false,
			page: 10,
			total: 6
		});

		expect(push).toHaveBeenCalledWith(expect.stringContaining('page=3'));
	});

	it('should redirect to page 1 when the page is below the valid range', () => {
		const push = renderHook({
			delta: 20,
			loading: false,
			page: 0,
			total: 3
		});

		expect(push).toHaveBeenCalledWith(expect.stringContaining('page=1'));
	});

	it('should redirect to page 1 when the page is negative', () => {
		const push = renderHook({
			delta: 20,
			loading: false,
			page: -5,
			total: 3
		});

		expect(push).toHaveBeenCalledWith(expect.stringContaining('page=1'));
	});

	it('should redirect to page 1 when there are no results at all', () => {
		const push = renderHook({
			delta: 20,
			loading: false,
			page: 3,
			total: 0
		});

		expect(push).toHaveBeenCalledWith(expect.stringContaining('page=1'));
	});

	it('should not redirect when the page is within range', () => {
		const push = renderHook({
			delta: 20,
			loading: false,
			page: 1,
			total: 3
		});

		expect(push).not.toHaveBeenCalled();
	});

	it('should not redirect while the request is still loading', () => {
		const push = renderHook({
			delta: 20,
			loading: true,
			page: 2,
			total: 3
		});

		expect(push).not.toHaveBeenCalled();
	});

	it('should not redirect before the total is known', () => {
		const push = renderHook({
			delta: 20,
			loading: false,
			page: 2,
			total: undefined
		});

		expect(push).not.toHaveBeenCalled();
	});
});
