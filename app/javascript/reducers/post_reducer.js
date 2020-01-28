import { LIKE_POST, LOAD_LIKES } from '../actions/types'; 

const INITIAL_STATE = {
    loadedLikes: false,
    likes: []
}

function postInteraction(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LOAD_LIKES: 
            return {
                ...state,
                loadedLikes: action.data.loadedLikes,
                likes: action.data.likes
            }
        case LIKE_POST:
            for(let i = 0; i < state.likes.length; i++) {
                if(state.likes[i].id === action.post.id) {
                    return {
                        ...state,
                        likes: [...state.likes.splice(0, i), ...state.splice(i + 1)]
                    } 
                }
            }
            return {...state, likes: [...state.likes, action.post]}
        default:
            return state;
    }
}

export default postInteraction;