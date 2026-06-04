import {setUriQueryValue} from 'shared/util/router';
import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';

type ClampedPageParams = {
	delta: number;
	loading: boolean;
	page: number;
	total?: number;
};

/**
 * Redirects to the last valid page when the current page is out of range.
 *
 * List pages read `page` straight from the URL without any bounds checking, so
 * a stale or shared link (or a hand-edited `page` param) can request a page
 * outside the valid range. A page past the end renders the onboarding empty
 * state even though items exist (LPD-93657); a page below 1 leaves the URL out
 * of sync with the first page the backend falls back to. Once the request
 * resolves we know the real `total`, so clamp `page` into
 * `[1, ceil(total / delta)]` — collapsing to page 1 when there are no results.
 */
export const useClampedPage = ({
	delta,
	loading,
	page,
	total
}: ClampedPageParams): void => {
	const history = useHistory();

	useEffect(() => {
		if (loading || total == null || delta <= 0) {
			return;
		}

		const lastPage = total > 0 ? Math.ceil(total / delta) : 1;

		if (page < 1 || page > lastPage) {
			history.push(
				setUriQueryValue(
					window.location.href,
					'page',
					Math.min(Math.max(page, 1), lastPage)
				)
			);
		}
	}, [delta, history, loading, page, total]);
};
