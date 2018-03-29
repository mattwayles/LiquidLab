import * as actionTypes from './actionTypes';

export const calculateResults = (control, value) => {
    return {
        type: actionTypes.CALCULATE_RESULTS,
        control: control,
        value: value
    }
};