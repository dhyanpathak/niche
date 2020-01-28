import axios from 'axios';
import { LOAD_LIKES, LIKE_POST, LOAD_HOME, LOAD_SPOTLIGHT, LOAD_CURATED } from './types';

export const likePost = (id) => async dispatch => {
    axios.get('/api/posts/' + id + '/like', { withCredentials: true })
        .then(resp => {
            dispatch({ type: LIKE_POST, post: resp.data.post })
        })
        .catch(error => console.log('API ERROR:', error));
}

export const loadLikes = (id) => async dispatch => {
    let url = '/api/users/' + id + '/likes';
    axios.get(url, { withCredentials: true })
        .then(resp => {
            dispatch({
                type: LOAD_LIKES, 
                data: {
                    loadedLikes: true,
                    likes: resp.data.likes
                } 
            });
        })
    .catch(error => console.log('API ERROR:', error));
}

export const loadHome = (page) => async dispatch => {
    axios.get('/api/posts?page='+page,
    { withCredentials: true })
    .then(resp => {
        dispatch({
            type: LOAD_HOME, 
            data: {
                loaded: true, 
                spotlightData: resp.data.spotlight, 
                curatedData: resp.data.curated, 
                spotlightPage: page+1
            } 
        });
    })
    .catch(error => console.log('API ERROR:', error));
}

export const loadSpotlight = (page) => async dispatch => {
    axios.get('/api/posts?page=' + page,
        { withCredentials: true })
        .then(resp => {
            if (!resp) return;
            if (resp.data.spotlight.length < 1) return;
            dispatch({
                type: LOAD_SPOTLIGHT, 
                data: {
                    posts: resp.data.spotlight, 
                    page: page+1 
                } 
            });
        })
        .catch(error => console.log('API ERROR:', error));
}

export const loadCurated = () => async dispatch => {
    axios.get('/api/posts?page=1',
        { withCredentials: true })
        .then(resp => {
            if (!resp) return;
            if (resp.data.curated.length < 1) return;
            dispatch({
                type: LOAD_CURATED, 
                data: resp.data.curated
            });
        })
        .catch(error => console.log('API ERROR:', error));
}