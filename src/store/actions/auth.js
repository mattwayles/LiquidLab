import axios from '../../axios-ll';
import ErrorMessage from './error/errorMessage';
import * as actionTypes from './actionTypes';
import {clearDbRedux, createDatabaseUser, getDatabaseUser} from "./database";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// REGISTER A USER /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const register = (username, email, password) => {
    return dispatch => {
        dispatch(registerStart());
        const authData = {
            displayName: username,
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + process.env.REACT_APP_API_KEY;

        //Create the user to retrieve a session token used for querying the database
        axios.post(url, authData)
            .then(response => {

                //Use the token to query the list of registered display names and ensure no duplicates
                let registeredDisplayNames = [];
                axios.get('users.json?auth=' + response.data.idToken)
                    .then(displayNames => {

                        //Parse response for display names
                        for (let i in displayNames.data) {
                            registeredDisplayNames.push(displayNames.data[i].displayName.toLowerCase());
                        }

                        //If a duplicate display name is found, remove the user and send an error message
                        if (registeredDisplayNames.indexOf(username.toLowerCase()) >= 0) {
                            axios.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/deleteAccount?key=" + process.env.REACT_APP_API_KEY,
                                {idToken: response.data.idToken, localId: response.data.localId});
                            dispatch(registerFailed(ErrorMessage("USERNAME_TAKEN", username)));
                        }

                        //If no duplicate display name is found, create DB user and login
                        else {
                            dispatch(createDatabaseUser(username, email, response.data.localId, response.data.idToken));
                            dispatch(login(email, password));
                        }
                    })
                    .catch(error => {
                        //Error retrieving display names from database
                        dispatch(registerFailed(ErrorMessage(error.response ? error.response.data.error.message : error)));
                    });
            }).catch(error => {
                //Error creating user
            dispatch(registerFailed(ErrorMessage(error.response ? error.response.data.error.message : error)));
        });
    }
};

//Synchronous actions
export const registerStart = () => {
    return {
        type: actionTypes.REGISTER_START
    }
};

export const registerSuccess = (idToken, userId) => {
    return {
        type: actionTypes.REGISTER_SUCCESS,
        idToken,
        userId
    }
};

export const registerFailed = (error) => {
    return {
        type: actionTypes.REGISTER_FAILED,
        error: error
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// LOGIN A USER ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const login = (email, password) => {
    return dispatch => {
        dispatch(loginStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" + process.env.REACT_APP_API_KEY;

        axios.post(url, authData)
            .then(response => {
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(getDatabaseUser(response.data.localId, response.data.idToken));
            }).catch(error => {
            dispatch(loginFailed(ErrorMessage(error.response ? error.response.data.error.message : error)));
        });
    }
};

//Synchronous actions
export const loginStart = () => {
    return {
        type: actionTypes.LOGIN_START
    }
};

export const loginSuccess = (userId, idToken) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        idToken,
        userId
    }
};

export const loginFailed = (error) => {
    return {
        type: actionTypes.LOGIN_FAILED,
        error: error
    };
};


export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(clearDbRedux());
            dispatch(logout());
            }, expirationTime * 1000)
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(clearDbRedux());
            return dispatch(logout());

        }
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(clearDbRedux());
                dispatch(logout());
            }
            else {
                const userId = localStorage.getItem('userId');
                dispatch(loginSuccess(token, userId));
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
    localStorage.removeItem('dbEntryId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
};

export const clearAuthError = () => {
    return {
        type: actionTypes.CLEAR_AUTH_ERROR,
        error: null
    };
};