import axios from '../../axios-ll';
import ErrorMessage from './error/errorMessage';
import * as actionTypes from './actionTypes';
import {clearRecipe, selectUserRecipe, setWeightsRedux} from "./formula";


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
                dispatch(getDatabaseWeights(token, dbEntryId));
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
                const successMessage = recipe.batch.value ? "Successfully saved " + recipe.name.value + " [" +
                recipe.batch.value + "] to the database"
                    : "Successfully saved " + recipe.name.value + " to the database";
                dispatch(saveRecipeSuccess(successMessage));
                dispatch(getUserRecipes(token, dbEntryId));
                dispatch(selectUserRecipe(response.data.name, recipe));
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

export const saveRecipeSuccess = (success) => {
    return {
        type: actionTypes.SAVE_RECIPE_SUCCESS,
        success
    }
};

export const saveRecipeFailed = (error) => {
    return {
        type: actionTypes.SAVE_RECIPE_FAILED,
        error: error
    };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// UPDATE RECIPE ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const updateRecipe = (token, dbEntryId, key, recipe) => {
    return dispatch => {
        dispatch(updateRecipeStart());
        axios.patch('/users/' + dbEntryId + '/recipes/' + key + '.json?auth=' + token, recipe)
            .then(() => {
                const successMessage = recipe.batch.value ? "Successfully updated " + recipe.name.value + " [" +
                    recipe.batch.value + "] in the database"
                    : "Successfully updated " + recipe.name.value + " in the database";
                dispatch(updateRecipeSuccess(successMessage));
                dispatch(getUserRecipes(token, dbEntryId));
            }).catch(error => {
            dispatch(updateRecipeFailed(ErrorMessage(error.response.data.error.message)));

        });


    }
};

//Synchronous actions
export const updateRecipeStart = () => {
    return {
        type: actionTypes.UPDATE_RECIPE_START
    }
};

export const updateRecipeSuccess = (success) => {
    return {
        type: actionTypes.UPDATE_RECIPE_SUCCESS,
        success
    }
};

export const updateRecipeFailed = (error) => {
    return {
        type: actionTypes.UPDATE_RECIPE_FAILED,
        error: error
    };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// DELETE RECIPE ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const deleteRecipe = (token, dbEntryId, key, name, batch) => {
    return dispatch => {
        dispatch(deleteRecipeStart());
        axios.delete('/users/' + dbEntryId + '/recipes/' + key + '.json?auth=' + token)
            .then(() => {
                const successMessage = batch.value ? "Successfully removed " + name.value + " [" +
                    batch.value + "] from the database"
                    : "Successfully removed " + name.value + " from the database";
                dispatch(deleteRecipeSuccess(successMessage));
                dispatch(clearRecipe());
                dispatch(getUserRecipes(token, dbEntryId));
            }).catch(error => {
            dispatch(deleteRecipeFailed(ErrorMessage(error.response.data.error.message)));

        });


    }
};

//Synchronous actions
export const deleteRecipeStart = () => {
    return {
        type: actionTypes.DELETE_RECIPE_START
    }
};

export const deleteRecipeSuccess = (success) => {
    return {
        type: actionTypes.DELETE_RECIPE_SUCCESS,
        success
    }
};

export const deleteRecipeFailed = (error) => {
    return {
        type: actionTypes.DELETE_RECIPE_FAILED,
        error: error
    };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// SET WEIGHTS ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const setDbWeights = (token, dbEntryId, weights) => {
    return dispatch => {
        dispatch(setDbWeightsStart());
        axios.put('/users/' + dbEntryId + '/weights.json?auth=' + token, weights)
            .then(() => {
                const successMessage = "Successfully set ingredient weights in database";
                dispatch(setWeightsRedux(weights));
                dispatch(setDbWeightsSuccess(successMessage));
            }).catch(error => {
            dispatch(setDbWeightsFailed(ErrorMessage(error.response.data.error.message)));
        });


    }
};

//Synchronous actions
export const setDbWeightsStart = () => {
    return {
        type: actionTypes.SET_DATABASE_WEIGHTS_START,
    }
};

export const setDbWeightsSuccess = (success) => {
    return {
        type: actionTypes.SET_DATABASE_WEIGHTS_SUCCESS,
        success,
    }
};

export const setDbWeightsFailed = (error) => {
    return {
        type: actionTypes.SET_DATABASE_WEIGHTS_FAILED,
        error: error
    };
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// GET USER DATABASE WEIGHTS ///////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getDatabaseWeights = (token, dbEntryId) => {
    return dispatch => {
        dispatch(getDatabaseWeightsStart());
        axios.get('/users/' + dbEntryId + '/weights.json?auth=' + token)
            .then(response => {
                dispatch(setWeightsRedux(response.data));
                dispatch(getDatabaseWeightsSuccess());
            }).catch(error => {
            dispatch(getDatabaseWeightsFailed(ErrorMessage(error.response.data.error.message)));

        });


    }
};

//Synchronous actions
export const getDatabaseWeightsStart = () => {
    return {
        type: actionTypes.GET_DATABASE_WEIGHTS_START
    }
};

export const getDatabaseWeightsSuccess = () => {
    return {
        type: actionTypes.GET_DATABASE_WEIGHTS_SUCCESS,
    }
};

export const getDatabaseWeightsFailed = (error) => {
    return {
        type: actionTypes.GET_DATABASE_WEIGHTS_FAILED,
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

export const clearSuccessMessage = () => {
    return {
        type: actionTypes.CLEAR_SUCCESS
    }
};