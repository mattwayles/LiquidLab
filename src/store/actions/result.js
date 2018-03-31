import * as actionTypes from './actionTypes';

export const updateIngredients = (control, value) => {
    return {
        type: actionTypes.UPDATE_INGREDIENTS,
        control: control,
        value: value
    }
};

export const updateRecipeInfo = (control, value) => {
    return {
        type: actionTypes.UPDATE_RECIPE_INFO,
        control: control,
        value: value
    }
};