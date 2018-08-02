import axios from '../../axios-ll';
import ErrorMessage from './error/errorMessage';
import * as actionTypes from './actionTypes';


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// CREATE USER DATABASE ENTRY ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const createDatabaseUser = (email, userId, token) => {
    return dispatch => {
        dispatch(createDbUserStart());
        const payload = {email: email, id: userId};
        axios.post('/users.json?auth=' + token, payload)
            .then(response => {
                dispatch(createDbUserSuccess(response.data.name));
            }).catch(error => {
                dispatch(createDbUserFailed(ErrorMessage(error.response.data.error.message)));
        });
    };
};


//Synchronous actions
export const createDbUserStart = () => {
    return {
        type: actionTypes.CREATE_DB_USER_START
    }
};

export const createDbUserSuccess = (dbEntryId) => {
    return {
        type: actionTypes.CREATE_DB_USER_SUCCESS,
        dbEntryId
    }
};

export const createDbUserFailed = (error) => {
    return {
        type: actionTypes.CREATE_DB_USER_FAILED,
        error: error
    };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// RETRIEVE USER DATABASE ENTRY //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getDatabaseUser = (userId, token) => {
    return dispatch => {
        dispatch(getDbUserStart());
        axios.get('/users.json?auth=' + token + '&orderBy="id"&equalTo="' + userId + '"')
            .then(response => {
                const dbEntryId = Object.keys(response.data)[0];
                dispatch(getDbUserSuccess(dbEntryId));
                dispatch(getUserRecipes(token, dbEntryId));
            }).catch(error => {
            dispatch(getDbUserFailed(ErrorMessage(error.response.data.error.message)));
        });
    };
};


//Synchronous actions
export const getDbUserStart = () => {
    return {
        type: actionTypes.GET_DB_USER_START
    }
};

export const getDbUserSuccess = (dbEntryId) => {
    return {
        type: actionTypes.GET_DB_USER_SUCCESS,
        dbEntryId
    }
};

export const getDbUserFailed = (error) => {
    return {
        type: actionTypes.GET_DB_USER_FAILED,
        error: error
    };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// SAVE RECIPE ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const saveRecipe = (token, dbEntryId, recipe) => {
    return dispatch => {
        dispatch(saveRecipeStart());
        axios.post('/users/' + dbEntryId + '/recipes.json?auth=' + token, recipe)
            .then(response => {
                console.log("RECEIVED: ", response.data);
                dispatch(saveRecipeSuccess());
            }).catch(error => {
            dispatch(saveRecipeFailed(ErrorMessage(error.response.data.error.message)));

        });


    }
};

//Synchronous actions
export const saveRecipeStart = () => {
    return {
        type: actionTypes.SAVE_RECIPE_START
    }
};

export const saveRecipeSuccess = (token, userId) => {
    return {
        type: actionTypes.SAVE_RECIPE_SUCCESS,
        idToken: token,
        userId: userId
    }
};

export const saveRecipeFailed = (error) => {
    return {
        type: actionTypes.SAVE_RECIPE_FAILED,
        error: error
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// GET USER RECIPES ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getUserRecipes = (token, dbEntryId) => {
    return dispatch => {
        dispatch(getUserRecipesStart());
        axios.get('/users/' + dbEntryId + '/recipes.json?auth=' + token)
            .then(response => {
                dispatch(getUserRecipesSuccess(response.data));
            }).catch(error => {
            dispatch(getUserRecipesFailed(ErrorMessage(error.response.data.error.message)));

        });


    }
};

//Synchronous actions
export const getUserRecipesStart = () => {
    return {
        type: actionTypes.GET_USER_RECIPES_START
    }
};

export const getUserRecipesSuccess = (recipes) => {
    return {
        type: actionTypes.GET_USER_RECIPES_SUCCESS,
        recipes: recipes,
    }
};

export const getUserRecipesFailed = (error) => {
    return {
        type: actionTypes.GET_USER_RECIPES_FAILED,
        error: error
    };
};

export const clearDbRedux = () => {
    return {
        type: actionTypes.CLEAR_DB_REDUX
    }
};