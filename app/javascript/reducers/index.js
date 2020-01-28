import { combineReducers } from 'redux';
import postInteraction from './post_reducer';
import pageInteraction from './page_reducer'

const rootReducer = combineReducers({
    postInteraction,
    pageInteraction
});

export default rootReducer;