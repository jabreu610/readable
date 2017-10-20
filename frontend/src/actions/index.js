import * as Api from '../util/api'
export const SET_CATEGORIES = '[Categories] Set categories from server';
export const FETCH_CATEGORIES = '[Categories] Fetch categories from server';

export const setCategories = categories => ({
    type: SET_CATEGORIES,
    payload: categories,
});

export const fetchCategories = () => dispatch => {
    dispatch({type: FETCH_CATEGORIES});
    Api.fetchCategories().then(categories => dispatch(setCategories(categories)));
}