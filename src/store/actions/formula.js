import * as actionTypes from './actionTypes';

export const quantityDataEntered = (control, value) => {
    return {
        type: actionTypes.QUANTITY_DATA_ENTERED,
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