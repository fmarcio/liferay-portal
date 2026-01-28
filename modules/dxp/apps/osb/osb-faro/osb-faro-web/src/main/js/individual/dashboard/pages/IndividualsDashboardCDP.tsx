import * as breadcrumbs from 'shared/util/breadcrumbs';
import BasePage from 'shared/components/base-page';
import BundleRouter from 'route-middleware/BundleRouter';
import Loading from 'shared/components/Loading';
import React, {lazy, Suspense} from 'react';
import RouteNotFound from 'shared/components/RouteNotFound';
import {Routes} from 'shared/util/router';
import {Switch} from 'react-router';
import {useChannelContext} from 'shared/context/channel';
import {useDataSource} from 'shared/hooks/useDataSource';
import {useParams} from 'react-router-dom';

const IndividualsOverviewCDP = lazy(
	() =>
		import(
			/* webpackChunkName: "IndividualsOverviewCDP" */ './IndividualsOverviewCDP'
		)
);

const IndividualsDashboardCDP = () => {
	const dataSourceStates = useDataSource();
	const {selectedChannel} = useChannelContext();
	const {channelId, groupId} = useParams();

	return (
		<BasePage
			className='individuals-dashboard-root'
			documentTitle={Liferay.Language.get('individuals')}
		>
			<BasePage.Header
				breadcrumbs={[
					breadcrumbs.getHome({
						channelId,
						groupId,
						label: selectedChannel && selectedChannel.name
					}),
					breadcrumbs.getEntityName({
						label: Liferay.Language.get('individuals')
					})
				]}
				groupId={groupId}
			>
				<BasePage.Header.TitleSection
					title={Liferay.Language.get('individuals')}
				/>
			</BasePage.Header>

			<Suspense fallback={<Loading />}>
				<Switch>
					<BundleRouter
						data={IndividualsOverviewCDP}
						destructured={false}
						exact
						path={Routes.CONTACTS_INDIVIDUALS}
					/>

					<RouteNotFound />
				</Switch>
			</Suspense>
		</BasePage>
	);
};

export default IndividualsDashboardCDP;
