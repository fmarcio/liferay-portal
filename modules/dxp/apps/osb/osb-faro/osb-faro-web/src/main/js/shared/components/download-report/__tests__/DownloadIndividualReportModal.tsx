import mockStore from 'test/mock-store';
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {act, cleanup, fireEvent, render} from '@testing-library/react';
import {DownloadReportButton} from '../DownloadReportButton';
import {Modal} from '../DownloadIndividualReportModal';
import {Provider} from 'react-redux';
import {useModal} from '@clayui/modal';

jest.unmock('react-dom');

const WrapperComponent = () => {
	const [visible, setVisible] = useState(false);
	const {observer} = useModal({onClose: () => setVisible(false)});

	return (
		<>
			{visible && (
				<Provider store={mockStore()}>
					<Modal observer={observer} onClose={jest.fn()} />
				</Provider>
			)}

			<DownloadReportButton
				disabled={false}
				onClick={() => setVisible(true)}
			/>
		</>
	);
};

describe('DownloadIndividualReportModal', () => {
	afterEach(() => {
		jest.clearAllTimers();

		cleanup();
	});

	beforeAll(() => {
		jest.useFakeTimers();

		// @ts-ignore
		ReactDOM.createPortal = jest.fn(element => element);
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it('renders component', () => {
		const {container, debug, getByRole, getByTestId} = render(
			<WrapperComponent />
		);

		// fireEvent.click(
		// 	getByRole('button', {
		// 		name: /download report/i
		// 	})
		// );

		// act(() => {
		// 	jest.runAllTimers();
		// });

		// expect(
		// 	getByRole('heading', {
		// 		name: /download report/i
		// 	})
		// ).toBeInTheDocument();

		// expect(getByTestId('cancel')).toBeInTheDocument();
		// expect(getByTestId('submit')).toBeInTheDocument();

		// debug();

		expect(container).toMatchSnapshot();
	});
});
