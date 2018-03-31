import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility.js';

const initialState = {
    inputs: {
        name: '',
        batch: '',
        mlToMake: null,
        targetNic: null,
        targetPg: null,
        targetVg: null,
        notes: null
    },
    weights: {
        nicStrength: 100,
        nicBasePg: 0,
        nicBaseVg: 100,
        flavorWeight: 1,
        nicWeight: 1.24,
        pgWeight: 1.04,
        vgWeight: 1.26
    },
    flavors: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INPUT_DATA_ENTERED:
            const updatedQuantity = updateObject(state.inputs, {[action.control]: action.value});
            return updateObject(state, {inputs: updatedQuantity});
        case actionTypes.RECIPE_DATA_ENTERED: return updateObject(state, { flavors: action.flavors });
        case actionTypes.UPDATE_INGREDIENTS: return {...state};
        case actionTypes.UPDATE_RECIPE_INFO: return {...state};
        default: return initialState
    }
};


export default reducer;