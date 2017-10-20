import * as actions from '../actions'
const initialState = {
    categories: [],
    posts: [],
}

function reducer (state = initialState, action) {
    switch (action.type) {
        case actions.SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload.categories,
            }
        case actions.SET_POSTS:
            return {
                ...state,
                posts: action.payload,
            }
        default:
            return state;
    }
}

export default reducer;