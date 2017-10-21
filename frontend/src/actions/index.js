import * as Api from '../util/api'
export const SET_CATEGORIES = '[Categories] Set categories from server';
export const FETCH_CATEGORIES = '[Categories] Fetch categories from server';
export const SET_POSTS = '[Posts] Set posts from server';
export const FETCH_POSTS = "[Posts] Fetch posts from server";
export const FETCH_POSTS_BY_CATEGORY = "[Posts] Fetch posts by category from server";
export const FETCH_POST_DETAILS = '[Post Details] Fetch post details from server';
export const SET_POST_DETAILS = '[Post Details] Set post details from server';
export const FETCH_POST_COMMENTS = '[Post Details] Fetch post comments from server';
export const SET_POST_COMMENTS = '[Post Details] Set post comments from server';
export const POST_NEW_COMMENT = '[Post Details] Post comment to server';

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

export const setPostDetails = details => ({
    type: SET_POST_DETAILS,
    payload: details,
});

export const fetchPostDetails = id => dispatch => {
    dispatch({ type: FETCH_POST_DETAILS });
    Api.fetchPostsDetails(id).then(details => dispatch(setPostDetails(details)));
}

export const setPostComments = comments => ({
    type: SET_POST_COMMENTS,
    payload: comments,
});

export const fetchPostComments = id => dispatch => {
    dispatch({ type: FETCH_POST_COMMENTS });
    Api.fetchCommentsForPost(id).then(comments => dispatch(setPostComments(comments)));
}

export const postComment = comment => dispatch => {
    dispatch({ type: POST_NEW_COMMENT });
    const post_id = comment.parentId;
    Api.postNewComment(comment).then(() =>
      dispatch(fetchPostComments(post_id))
    );
}