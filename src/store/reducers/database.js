import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/shared.js';

const initialState = {
    dbEntryId: null,
    userRecipes: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_DB_USER_START:return createDbUserStart(state, action);
        case actionTypes.CREATE_DB_USER_SUCCESS:return createDbUserSuccess(state, action);
        case actionTypes.CREATE_DB_USER_FAILED:return createDbUserFailed(state, action);
        case actionTypes.GET_DB_USER_START:return getDbUserStart(state, action);
        case actionTypes.GET_DB_USER_SUCCESS:return getDbUserSuccess(state, action);
        case actionTypes.GET_DB_USER_FAILED:return getDbUserFailed(state, action);
        case actionTypes.GET_USER_RECIPES_START:return getUserRecipesStart(state, action);
        case actionTypes.GET_USER_RECIPES_SUCCESS:return getUserRecipesSuccess(state, action);
        case actionTypes.GET_USER_RECIPES_FAILED:return getUserRecipesFailed(state, action);
        case actionTypes.CLEAR_DB_REDUX: return clearDatabaseRedux(state);
        case actionTypes.CLEAR_ERROR: return clearError(state, action);
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



export default reducer;