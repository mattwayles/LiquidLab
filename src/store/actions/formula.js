import * as actionTypes from './actionTypes';

export const checkInputValidity = (control, value) => {
    let valid = true;

    valid = valid && value >= 0;

    return {
        type: actionTypes.CHECK_INPUT_VALIDITY,
        state: 'state.inputs',
        control: control,
        value: value,
        valid: valid
    }
};

export const checkValidityCompare = (control1, value1, control2, value2) => {
    let valid = true;
    
    valid = valid && +value1 + +value2 === 100;

    return {
        type: actionTypes.CHECK_VALIDITY_COMPARE,
        value1: value1,
        value2: value2,
        valid: valid
    }
};

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