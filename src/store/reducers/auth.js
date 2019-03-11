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
        case actionTypes.LOGIN_START:return loginStart(state, action);
        case actionTypes.LOGIN_SUCCESS:return loginSuccess(state, action);
        case actionTypes.LOGIN_FAILED:return loginFailed(state, action);
        case actionTypes.REGISTER_START:return registerStart(state, action);
        case actionTypes.REGISTER_SUCCESS:return registerSuccess(state, action);
        case actionTypes.REGISTER_FAILED:return registerFailed(state, action);
        case actionTypes.SET_AUTH_REDIRECT: return setAuthRedirectPath(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.CLEAR_AUTH_ERROR: return clearError(state, action);
        default: return state;
    }
};


const loginStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const loginSuccess = (state, action) => {
    return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false });
};

const loginFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};

const registerStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const registerSuccess = (state, action) => {
    return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false });
};

const registerFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path });
};

const authLogout = (state) => {
    return updateObject(state, {
        token: null,
        userId: null })
};

const clearError = (state) => {
    return updateObject(state, {
        error: null
    })
};



export default reducer;