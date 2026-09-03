import React, {useState} from 'react';
import withRequest from '../WithRequest';
import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router';

jest.unmock('react-dom');

const mockData = {total: 7};

const mapTotalToCount = ({total}) => ({count: total});

/**
 * Settles the already resolved request promise and the state update it
 * schedules. The requests below never touch the network, so flushing the
 * microtask queue once is enough and leaves nothing waiting on a clock.
 */
function flushRequest() {
	return act(async () => {});
}

describe('WithRequest', () => {
	afterEach(cleanup);

	it('should render the loading state until the request resolves', async () => {
		const request = jest.fn(() => Promise.resolve(mockData));

		const WrappedComponent = withRequest(
			request,
			mapTotalToCount
		)(({count}) => <div>{`count:${count}`}</div>);

		const {container} = render(<WrappedComponent groupId='23' />);

		expect(container.querySelector('.loading-root')).toBeTruthy();

		await flushRequest();

		expect(screen.getByText('count:7')).toBeInTheDocument();
	});

	it('should pass the mapped result and the groupId to the wrapped component', async () => {
		const request = jest.fn(() => Promise.resolve(mockData));

		const WrappedComponent = withRequest(
			request,
			mapTotalToCount
		)(({count, groupId}) => <div>{`${groupId}:${count}`}</div>);

		render(<WrappedComponent groupId='23' />);

		await flushRequest();

		expect(screen.getByText('23:7')).toBeInTheDocument();
	});

	it('should render the error page when the request fails', async () => {
		const request = jest.fn(() => Promise.reject(new Error('failed')));

		const WrappedComponent = withRequest(request)(() => (
			<div>{'content'}</div>
		));

		const {container} = render(
			<MemoryRouter>
				<WrappedComponent groupId='23' />
			</MemoryRouter>
		);

		await flushRequest();

		expect(container.querySelector('.error-page-root')).toBeTruthy();
	});

	// Composing inside the render made the wrapped subtree a new component type
	// on every render, so an ancestor re-render silently threw its state away and
	// refetched. See LPD-104396, where that also discarded the `useBlocker`
	// registration of the segment editor and left the user unable to navigate.

	it('should keep the wrapped component mounted when an ancestor re-renders', async () => {
		const request = jest.fn(() => Promise.resolve(mockData));

		const WrappedComponent = withRequest(
			request,
			mapTotalToCount
		)(({count}) => {
			const [draft, setDraft] = useState('');

			return (
				<div>
					<input
						aria-label='draft'
						onChange={event => setDraft(event.target.value)}
						value={draft}
					/>

					<span>{`count:${count}`}</span>
				</div>
			);
		});

		const Ancestor = () => {
			const [renderCount, setRenderCount] = useState(0);

			return (
				<div>
					<button onClick={() => setRenderCount(renderCount + 1)}>
						{'re-render'}
					</button>

					<WrappedComponent groupId='23' />
				</div>
			);
		};

		render(<Ancestor />);

		await flushRequest();

		expect(screen.getByText('count:7')).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText('draft'), {
			target: {value: 'unsaved work'}
		});

		fireEvent.click(screen.getByText('re-render'));

		expect(screen.getByLabelText('draft')).toHaveValue('unsaved work');
		expect(request).toHaveBeenCalledTimes(1);
	});
});
