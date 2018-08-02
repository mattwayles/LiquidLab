import axios from '../../axios-ll';
import ErrorMessage from './error/errorMessage';
import * as actionTypes from './actionTypes';
import {clearDbRedux, createDatabaseUser, getDatabaseUser} from "./database";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// AUTHENTICATE A USER /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const auth = (email, password, register) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        //TODO: Remove key
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAMrC9UObNobVpzQmJ-xDnMBLfeorOpwBU";
        if (!register) {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAMrC9UObNobVpzQmJ-xDnMBLfeorOpwBU";
        }
        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                if (!register) {
                    dispatch(getDatabaseUser(response.data.localId, response.data.idToken));
                }
                else {
                    dispatch(createDatabaseUser(email, response.data.localId, response.data.idToken));
                }
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            }).catch(error => {
                dispatch(authFailed(ErrorMessage(error.response.data.error.message)));

        });


    }
};

//Synchronous actions
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};

export const authSuccess = (idToken, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken,
        userId
    }
};

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    };
};



export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(clearDbRedux());
            dispatch(logout());}, expirationTime * 1000)
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT,
        path: path
    }
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(clearDbRedux())
            return dispatch(logout());
        }
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(clearDbRedux());
                dispatch(logout());
               ;
            }
            else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(getDatabaseUser(userId, token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('dbEntryId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const clearError = (error) => {
    return {
        type: actionTypes.CLEAR_ERROR,
        error: error
    }
};