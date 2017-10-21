import * as Api from "../util/api";
export const SET_CATEGORIES = "[Categories] Set categories from server";
export const FETCH_CATEGORIES = "[Categories] Fetch categories from server";
export const SET_POSTS_SORT = "[Posts] Set posts sort order";
export const SET_POSTS = "[Posts] Set posts from server";
export const FETCH_POSTS = "[Posts] Fetch posts from server";
export const FETCH_POSTS_BY_CATEGORY =
    "[Posts] Fetch posts by category from server";
export const FETCH_POST_DETAILS =
    "[Post Details] Fetch post details from server";
export const FETCH_COMMENT_DETAILS =
    "[Post Details] Fetch comment details from server";
export const SET_POST_DETAILS = "[Post Details] Set post details from server";
export const CLEAR_POST_DETAILS =
    "[Post Details] Clear post details from store";
export const CLEAR_COMMENT_DETAILS =
    "[Post Details] Clear comment details from store";
export const SET_COMMENT_DETAILS =
    "[Post Details] Set comment details from server";
export const FETCH_POST_COMMENTS =
    "[Post Details] Fetch post comments from server";
export const SET_POST_COMMENTS = "[Post Details] Set post comments from server";
export const POST_NEW_COMMENT = "[Post Details] Post comment to server";
export const DELETE_COMMENT = "[Post Details] Remove comment from server";
export const EDIT_COMMENT = "[Post Details] Edit comment on server";
export const POST_NEW_POST = "[Post Details] Post new post to server";
export const DELETE_POST = "[Posts] Remove post from server";
export const EDIT_POST = "[Edit Posts] Edit post on server";
export const VOTE_FOR_COMMENT = "[Post Details] Post vote on comment to server";
export const VOTE_FOR_POST = "[Post Details] Post vote on post to server";
export const SHOW_COMMENTS_EDIT_MODAL =
    "[Post Details] Show comments editor modal";
export const HIDE_COMMENTS_EDIT_MODAL =
    "[Post Details] Hide comments editor modal";

export const setCategories = categories => ({
    type: SET_CATEGORIES,
    payload: categories,
});

export const fetchCategories = () => dispatch => {
    dispatch({ type: FETCH_CATEGORIES });
    Api.fetchCategories().then(categories =>
        dispatch(setCategories(categories))
    );
};

export const setPostsSort = sort_by => ({
    type: SET_POSTS_SORT,
    payload: sort_by,
});

export const setPosts = posts => ({
    type: SET_POSTS,
    payload: posts,
});

export const fetchPosts = () => dispatch => {
    dispatch({ type: FETCH_POSTS });
    Api.fetchAllPosts().then(posts => dispatch(setPosts(posts)));
};

export const fetchPostByCategory = category => dispatch => {
    dispatch({ type: FETCH_POSTS_BY_CATEGORY });
    Api.fetchPostsByCategory(category).then(posts => dispatch(setPosts(posts)));
};

export const setPostDetails = details => ({
    type: SET_POST_DETAILS,
    payload: details,
});

export const clearPostDetails = () => ({
    type: CLEAR_POST_DETAILS,
});

export const clearCommentDetails = () => ({
    type: CLEAR_COMMENT_DETAILS,
});

export const showCommentsEditModal = () => ({
    type: SHOW_COMMENTS_EDIT_MODAL,
});

export const hideCommentsEditModal = () => ({
    type: HIDE_COMMENTS_EDIT_MODAL,
});

export const setCommentDetails = details => ({
    type: SET_COMMENT_DETAILS,
    payload: details,
});

export const fetchPostDetails = id => dispatch => {
    dispatch({ type: FETCH_POST_DETAILS });
    Api.fetchPostsDetails(id).then(details =>
        dispatch(setPostDetails(details))
    );
};

export const fetchCommentDetails = id => dispatch => {
    dispatch({ type: FETCH_COMMENT_DETAILS });
    Api.fetchCommentDetails(id).then(details =>
        dispatch(setCommentDetails(details))
    );
};

export const setPostComments = comments => ({
    type: SET_POST_COMMENTS,
    payload: comments,
});

export const fetchPostComments = id => dispatch => {
    dispatch({ type: FETCH_POST_COMMENTS });
    Api.fetchCommentsForPost(id).then(comments =>
        dispatch(setPostComments(comments))
    );
};

export const postPost = post => dispatch => {
    dispatch({ type: POST_NEW_POST });
    Api.postNewPost(post).then(() => dispatch(fetchPosts()));
};

export const deletePost = post => dispatch => {
    dispatch({ type: DELETE_POST });
    const { id, location, category } = post;
    Api.deletePost(id).then(() => {
        if (location === "root") {
            if (category) {
                dispatch(fetchPostByCategory(category));
            } else {
                dispatch(fetchPosts());
            }
        } else {
            dispatch(fetchPosts());
        }
    });
};

export const editPost = post => dispatch => {
    dispatch({ type: EDIT_POST });
    Api.editPost(post).then(() => dispatch(fetchPosts()));
};

export const postComment = comment => dispatch => {
    dispatch({ type: POST_NEW_COMMENT });
    const post_id = comment.parentId;
    Api.postNewComment(comment).then(() =>
        dispatch(fetchPostComments(post_id))
    );
};

export const deleteComment = comment => dispatch => {
    dispatch({ type: DELETE_COMMENT });
    const post_id = comment.parentId;
    Api.deleteComment(comment.commentId).then(() =>
        dispatch(fetchPostComments(post_id))
    );
};

export const editComment = comment => dispatch => {
    dispatch({ type: EDIT_COMMENT });
    const post_id = comment.parentId;
    Api.editComment(comment).then(() => dispatch(fetchPostComments(post_id)));
};

export const postVoteForComment = vote => dispatch => {
    dispatch({ type: VOTE_FOR_COMMENT });
    const post_id = vote.parentId;
    Api.voteForComment(vote).then(() => dispatch(fetchPostComments(post_id)));
};

export const postVoteForPost = vote => dispatch => {
    dispatch({ type: VOTE_FOR_POST });
    const { location, category, postId } = vote;
    delete vote["location"];
    delete vote["category"];
    Api.voteForPost(vote).then(() => {
        if (location === "root") {
            if (category) {
                dispatch(fetchPostByCategory(category));
            } else {
                dispatch(fetchPosts());
            }
        } else {
            dispatch(fetchPostDetails(postId));
        }
    });
};
