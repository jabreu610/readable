import * as Api from '../util/api'
export const SET_CATEGORIES = '[Categories] Set categories from server';
export const FETCH_CATEGORIES = '[Categories] Fetch categories from server';
export const SET_POSTS = '[Posts] Set posts from server';
export const FETCH_POSTS = "[Posts] Fetch posts from server";
export const FETCH_POSTS_BY_CATEGORY = "[Posts] Fetch posts by category from server";

export const setCategories = categories => ({
    type: SET_CATEGORIES,
    payload: categories,
});

export const fetchCategories = () => dispatch => {
    dispatch({type: FETCH_CATEGORIES});
    Api.fetchCategories().then(categories => dispatch(setCategories(categories)));
}

export const setPosts = posts => ({
    type: SET_POSTS,
    payload: posts,
});

export const fetchPosts = () => dispatch => {
    dispatch({type: FETCH_POSTS});
    Api.fetchAllPosts().then(posts => dispatch(setPosts(posts)));
}

export const fetchPostByCategory = category => dispatch => {
    dispatch({type: FETCH_POSTS_BY_CATEGORY});
    Api.fetchPostsByCategory(category).then(posts => dispatch(setPosts(posts)));
}