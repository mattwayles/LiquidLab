import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/shared.js';

const initialState = {
    token: null,
    userId: null,
    loading: null,
    error: null,
    forgotPass: false,
    authRedirectPath: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:return authStart(state, action);
        case actionTypes.AUTH_SUCCESS:return authSuccess(state, action);
        case actionTypes.AUTH_FAILED:return authFailed(state, action);
        case actionTypes.SET_AUTH_REDIRECT: return setAuthRedirectPath(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.CLEAR_ERROR: return clearError(state, action);
        default: return state;
    }
};


const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false });
};

const authFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path });
};

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        userId: null })
};

const clearError = (state, action) => {
    return updateObject(state, {
        error: null
    })
};



export default reducer;