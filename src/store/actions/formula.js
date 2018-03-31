import * as actionTypes from './actionTypes';

export const inputDataEntered = (control, value) => {
    return {
        type: actionTypes.INPUT_DATA_ENTERED,
        control: control,
        value: value
    }
};

export const recipeDataEntered = (arr) => {
    return {
        type: actionTypes.RECIPE_DATA_ENTERED,
        flavors: arr
    }
};