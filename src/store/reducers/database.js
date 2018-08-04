import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/shared.js';

const initialState = {
    dbEntryId: null,
    userRecipes: {},
    success: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_DB_USER_START:return createDbUserStart(state, action);
        case actionTypes.CREATE_DB_USER_SUCCESS:return createDbUserSuccess(state, action);
        case actionTypes.CREATE_DB_USER_FAILED:return createDbUserFailed(state, action);
        case actionTypes.GET_DB_USER_START:return getDbUserStart(state, action);
        case actionTypes.GET_DB_USER_SUCCESS:return getDbUserSuccess(state, action);
        case actionTypes.GET_DB_USER_FAILED:return getDbUserFailed(state, action);
        case actionTypes.SAVE_RECIPE_START:return saveRecipeStart(state, action);
        case actionTypes.SAVE_RECIPE_SUCCESS:return saveRecipeSuccess(state, action);
        case actionTypes.SAVE_RECIPE_FAILED:return saveRecipeFailed(state, action);
        case actionTypes.UPDATE_RECIPE_START:return updateRecipeStart(state, action);
        case actionTypes.UPDATE_RECIPE_SUCCESS:return updateRecipeSuccess(state, action);
        case actionTypes.UPDATE_RECIPE_FAILED:return updateRecipeFailed(state, action);
        case actionTypes.DELETE_RECIPE_START:return deleteRecipeStart(state, action);
        case actionTypes.DELETE_RECIPE_SUCCESS:return deleteRecipeSuccess(state, action);
        case actionTypes.DELETE_RECIPE_FAILED:return deleteRecipeFailed(state, action);
        case actionTypes.GET_USER_RECIPES_START:return getUserRecipesStart(state, action);
        case actionTypes.GET_USER_RECIPES_SUCCESS:return getUserRecipesSuccess(state, action);
        case actionTypes.GET_USER_RECIPES_FAILED:return getUserRecipesFailed(state, action);
        case actionTypes.CLEAR_DB_REDUX: return clearDatabaseRedux(state);
        case actionTypes.CLEAR_DATABASE_ERROR: return clearError(state, action);
        case actionTypes.CLEAR_SUCCESS: return clearSuccess(state, action);
        default: return state;
    }
};


const createDbUserStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const createDbUserSuccess = (state, action) => {
    return updateObject(state, {
        dbEntryId: action.dbEntryId,
        error: null,
        loading: false });
};

const createDbUserFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};


const getDbUserStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const getDbUserSuccess = (state, action) => {
    return updateObject(state, {
        dbEntryId: action.dbEntryId,
        error: null,
        loading: false });
};

const getDbUserFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};

const saveRecipeStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const saveRecipeSuccess = (state, action) => {
    return updateObject(state, {
        success: action.success,
        error: null,
        loading: false });
};

const saveRecipeFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};


const updateRecipeStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const updateRecipeSuccess = (state, action) => {
    return updateObject(state, {
        success: action.success,
        error: null,
        loading: false });
};

const updateRecipeFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};


const deleteRecipeStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const deleteRecipeSuccess = (state, action) => {
    return updateObject(state, {
        success: action.success,
        error: null,
        loading: false });
};

const deleteRecipeFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};

const getUserRecipesStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true });
};

const getUserRecipesSuccess = (state, action) => {
    return updateObject(state, {
        userRecipes: action.recipes,
        error: null,
        loading: false });
};

const getUserRecipesFailed = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false });
};

const clearDatabaseRedux = (state) => {
    return updateObject(state, initialState);
};

const clearError = (state) => {
    return updateObject(state, {
        error: null
    })
};

const clearSuccess = (state) => {
    return updateObject(state, {
        success: null
    })
};



export default reducer;