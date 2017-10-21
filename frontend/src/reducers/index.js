import * as actions from "../actions";
const initialState = {
    categories: [],
    posts: [],
    post_details: {
        details: {
            id: null,
            timestamp: null,
            title: "",
            body: "",
            author: "",
            category: "",
            voteScore: 0,
            deleted: false,
        },
        comments: [],
    },
    comment_details: {
        id: null,
        timestamp: null,
        body: "",
        author: "",
        parentId: "",
        voteScore: 0,
        deleted: false,
    },
    show_comments_edit_modal: false,
    sort_posts_by: "voteScore",
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case actions.SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload.categories,
            };
        case actions.SET_POSTS_SORT:
            return {
                ...state,
                sort_posts_by: action.payload,
            };
        case actions.SET_POSTS:
            return {
                ...state,
                posts: action.payload,
            };
        case actions.SET_POST_DETAILS:
            return {
                ...state,
                post_details: {
                    ...state.post_details,
                    details: action.payload,
                },
            };
        case actions.CLEAR_POST_DETAILS:
            return {
                ...state,
                post_details: {
                    details: {
                        id: null,
                        timestamp: null,
                        title: "",
                        body: "",
                        author: "",
                        category: "",
                        voteScore: 0,
                        deleted: false,
                    },
                    comments: [],
                },
            };
        case actions.CLEAR_COMMENT_DETAILS:
            return {
                ...state,
                comment_details: {
                    id: null,
                    timestamp: null,
                    body: "",
                    author: "",
                    parentId: "",
                    voteScore: 0,
                    deleted: false,
                },
            };
        case actions.SHOW_COMMENTS_EDIT_MODAL:
            return {
                ...state,
                show_comments_edit_modal: true
            };
        case actions.HIDE_COMMENTS_EDIT_MODAL:
            return {
                ...state,
                show_comments_edit_modal: false
            };
        case actions.SET_COMMENT_DETAILS:
            return {
                ...state,
                comment_details: action.payload,
            };
        case actions.SET_POST_COMMENTS:
            return {
                ...state,
                post_details: {
                    ...state.post_details,
                    comments: action.payload,
                },
            };
        default:
            return state;
    }
}

export default reducer;
