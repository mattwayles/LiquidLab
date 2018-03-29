import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility.js';

const initialState = {
    pg: {
        ml: null,
        grams: null,
        percent: null
    },
    vg: {
        ml: null,
        grams: null,
        percent: null
    },
    nic: {
        ml: null,
        grams: null,
        percent: null
    },
    flavors: [{
        ven: null,
        flavor: null,
        ml: null,
        grams: null,
        percent: null
    }],
    flavorMlTotal: 0
};

const reducer = (state = initialState, action) => {
    if (action.type === actionTypes.CALCULATE_RESULTS) {
        console.log("SETTING", action);
        return updateObject(state, {[action.control]: action.value})
    }
    return initialState;
};


export default reducer;