import { LOAD_HOME, LOAD_SPOTLIGHT, LOAD_CURATED } from '../actions/types'; 

const INITIAL_STATE = {
    loaded: false,
    spotlightPage: 1,
    spotlightData: [],
    curatedData: {} //contains array posts and array tags
}

function removeDuplicates(arr, key) {
    let lookup = new Set();
    return arr.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
}

function pageInteraction(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LOAD_HOME:
            return {
                ...state,
                spotlightData: action.data.spotlightData,
                spotlightPage: action.data.spotlightPage,
                curatedData: action.data.curatedData,
                loaded: action.data.loaded
            }
        case LOAD_SPOTLIGHT:
            return {
                ...state, 
                spotlightData: removeDuplicates([...state.spotlightData, ...action.data.posts], 'id'), 
                spotlightPage: action.data.page
            };
        case LOAD_CURATED:
            return {
                ...state, 
                curatedData: action.data
            }
        default:
            return state;
    }
}

export default pageInteraction;