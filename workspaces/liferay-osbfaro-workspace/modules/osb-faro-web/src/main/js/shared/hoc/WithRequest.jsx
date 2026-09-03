import React from 'react';
import withQuery from './WithQuery';
import {compose} from 'redux';
import {isFunction} from 'lodash';
import {withError, withLoading} from './util';

const defaultOptions = {
	errorProps: {},
	fadeIn: true,
	page: true
};

/**
 * HOC for handling loading, success, and error states when making an API request.
 * @param {function} request - The API request to call. Should return a Promise.
 * @param {function} mapResultToProps - Optional Should return the modified results.
 * @param {object} [options] - Optional configuration
 * @param {object|function} [options.errorProps] - The props that will be
 * passed to ErrorPage. If this is a function, then it will be passed an
 * object and is expected to return a props object for ErrorPage.
 * @param {Boolean} [options.page] - Whether the component is a page display or not.
 * @returns {Function} - The new component
 */
export default (request, mapResultToProps = val => val, options = {}) =>
	WrappedComponent => {
		const {errorProps, page} = {
			...defaultOptions,
			...options
		};

		// `Composed` is built once per wrapped component rather than on every
		// render. Composing inside the render made it a new component type each
		// time, so any re-render of an ancestor unmounted and remounted the whole
		// subtree, discarding its state and refetching. See LPD-104396: that
		// remount also deleted the `useBlocker` registration of a page guarded by
		// `NavigationWarning`, which silently dropped the pending navigation.

		const Composed = compose(
			withQuery(request, val => val),
			withError({page}),
			withLoading()
		)(({data, ...otherProps}) => (
			<WrappedComponent
				{...otherProps}
				{...mapResultToProps(data, otherProps)}
			/>
		));

		return ({errorProps: errorPropsFromProps, groupId, ...props}) => {
			const propsToError = isFunction(errorProps)
				? errorProps({groupId})
				: errorProps;

			return (
				<Composed
					{...props}
					errorProps={{...errorPropsFromProps, ...propsToError}}
					groupId={groupId}
				/>
			);
		};
	};
