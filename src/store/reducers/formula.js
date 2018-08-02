import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/shared.js';

const initialState = {
    inputs: {
        name: {
            value: '',
            valid: true
        },
        mlToMake: {
            value: 0,
            valid: true
        },
        targetNic: {
            value: 0,
            valid: true
        },
        targetPg: {
            value: 0,
            valid: true
        },
        targetVg: {
            value: 0,
            valid: true
        },
        batch: '',
        notes: null
    },
    weights: {
        //TODO: Remove hard-coded weights
        nicStrength: 100,
        nicBasePg: 0,
        nicBaseVg: 100,
        flavorWeight: 1,
        nicWeight: 1.24,
        pgWeight: 1.04,
        vgWeight: 1.26
    },
    flavors: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INPUT_DATA_ENTERED:
            const updatedQuantity = updateObject(state.inputs, {[action.control]: { value: action.value, valid: action.valid}});
            return updateObject(state, {inputs: updatedQuantity});
        case actionTypes.RECIPE_DATA_ENTERED: return updateObject(state, { flavors: action.flavors });
        case actionTypes.USER_RECIPE_SELECTED: return userRecipeSelected(state, action);
        case actionTypes.UPDATE_INGREDIENTS: return {...state};
        case actionTypes.UPDATE_RECIPE_INFO: return {...state};
        default: return initialState
    }
};


const userRecipeSelected = (state, action) => {
    console.log(action.recipe.flavors);
    return updateObject(state,
        {inputs: {
            name: {
                value: action.recipe.name ? action.recipe.name.value : initialState.inputs.name,
                valid: true
            },
            mlToMake: {
                value: action.recipe.mlToMake ? action.recipe.mlToMake.value : initialState.inputs.mlToMake,
                valid: true
            },
            targetNic: {
                value: action.recipe.targetNic ? action.recipe.name.targetNic : initialState.inputs.targetNic,
                valid: true
            },
            targetPg: {
                value: action.recipe.targetPg ? action.recipe.targetPg.value : initialState.inputs.targetPg,
                valid: true
            },
            targetVg: {
                value: action.recipe.targetVg ? action.recipe.targetVg.value : initialState.inputs.targetVg,
                valid: true
            },
            batch: action.recipe.batch ? action.recipe.batch.value :  initialState.inputs.batch,
            notes: action.recipe.notes ? action.recipe.notes.value : initialState.inputs.notes
        },
            flavors: action.recipe.flavors
    })
};



export default reducer;