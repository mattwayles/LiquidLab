import * as actionTypes from './actionTypes';

export const inputDataEntered = (control, value, valid) => {
    return {
        type: actionTypes.INPUT_DATA_ENTERED,
        control,
        value,
        valid,
    }
};

export const recipeDataEntered = (arr) => {
    return {
        type: actionTypes.RECIPE_DATA_ENTERED,
        flavors: arr
    }
};

export const selectUserRecipe = (key, recipe) => {
    return {
        type: actionTypes.USER_RECIPE_SELECTED,
        key,
        recipe
    }
};

export const clearRecipe = () => {
    return {
        type: actionTypes.USER_RECIPE_CLEARED
    }
};