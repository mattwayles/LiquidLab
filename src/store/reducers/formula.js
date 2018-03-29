import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility.js';

const initialState = {
    quantity: {
        mlToMake: null,
        targetNic: null,
        targetPg: null,
        targetVg: null,
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
    notes: null,
    flavors: []
};

const reducer = (state = initialState, action) => {
    if (action.type === actionTypes.QUANTITY_DATA_ENTERED) {
        const updatedQuantity = updateObject(state.quantity, {[action.control]: action.value});
        return updateObject(state, {quantity: updatedQuantity})
    }
    if (action.type === actionTypes.RECIPE_DATA_ENTERED) {
        return updateObject(state, { flavors: action.flavors });
    }
    
    return initialState;
};


export default reducer;