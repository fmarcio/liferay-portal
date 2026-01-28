import BasePage from 'shared/components/base-page';
import Card from 'shared/components/Card';
import React from 'react';
import {CardSection} from 'segment/components/MembershipMetrics';

const IndividualsOverviewCDP = () => {
	const data = {};

	return (
		<BasePage.Body pageContainer>
			<Card
				className='d-flex flex-row justify-content-between'
				minHeight={100}
			>
				{/* TALVEZ NAO USE CARD SECTION - TO CONSIDERANDO CRIAR OUTRO
				COMPONENTE OU USAR O NOSSO CARD */}

				<CardSection
					data={data}
					description='TEST'
					loading={false}
					title='TEST TITLE'
				/>
				<CardSection
					data={data}
					description='TEST'
					loading={false}
					title='TEST TITLE'
				/>
				<CardSection
					data={data}
					description='TEST'
					loading={false}
					title='TEST TITLE'
				/>
			</Card>
		</BasePage.Body>
	);
};

export default IndividualsOverviewCDP;
