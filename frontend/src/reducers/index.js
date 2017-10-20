import * as actions from '../actions'
const initialState = {
    categories: [],
}

function reducer (state = initialState, action) {
    switch (action.type) {
        case actions.SET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
            }
        default:
            return state;
    }
}

export default reducer;