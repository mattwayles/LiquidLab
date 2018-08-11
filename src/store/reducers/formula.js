import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/shared.js';

const initialState = {
    key: '',
    inputs: {
        name: {
            value: '',
            valid: true,
            touched: false
        },
        mlToMake: {
            value: '',
            valid: true,
            touched: false
        },
        targetNic: {
            value: '',
            valid: true,
            touched: false
        },
        targetPg: {
            value: '',
            valid: true,
            touched: false
        },
        targetVg: {
            value: '',
            valid: true,
            touched: false
        },
        batch: {value: '', touched: false},
        notes: {value: '', touched: false}
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
            const updatedTarget = updateObject(state.inputs, {[action.control]:
                    { value: action.value, valid: action.valid, touched: true}});
            return updateObject(state, {inputs: updatedTarget});
        case actionTypes.RECIPE_DATA_ENTERED: return updateObject(state, { flavors: action.flavors });
        case actionTypes.USER_RECIPE_SELECTED: return userRecipeSelected(state, action);
        case actionTypes.UPDATE_INGREDIENTS: return {...state};
        case actionTypes.UPDATE_RECIPE_INFO: return {...state};
        case actionTypes.USER_RECIPE_CLEARED: return {...initialState};
        case actionTypes.SET_WEIGHTS_REDUX: return updateObject(state, { weights: action.weights });
        case actionTypes.CLEAR_FORMULA_ERROR: return updateObject(state, {error: null});
        default: return {...state}
    }
};


const userRecipeSelected = (state, action) => {
    let loadedFlavors = action.recipe && action.recipe.flavors ? [...action.recipe.flavors] : [];
    for (let index in loadedFlavors) {
        if (loadedFlavors[index].ven) {
            loadedFlavors[index].ven.touched = false;
        }
        if (loadedFlavors[index].flavor) {
            loadedFlavors[index].flavor.touched = false;
        }
        if (loadedFlavors[index].percent) {
            loadedFlavors[index].percent.touched = false;
        }
    }

    return updateObject(state,
        {inputs: {
            mlToMake: state.inputs.mlToMake,
            name: {
                value: action.recipe.name ? action.recipe.name.value : initialState.inputs.name,
                valid: true,
                touched: false
            },
            targetNic: {
                value: action.recipe.targetNic ? action.recipe.targetNic.value : initialState.inputs.targetNic,
                valid: true,
                touched: false
            },
            targetPg: {
                value: action.recipe.targetPg ? action.recipe.targetPg.value : initialState.inputs.targetPg,
                valid: true,
                touched: false
            },
            targetVg: {
                value: action.recipe.targetVg ? action.recipe.targetVg.value : initialState.inputs.targetVg,
                valid: true,
                touched: false
            },
            batch: {value: action.recipe.batch ? action.recipe.batch.value : initialState.batch.value, touched: false},
            notes: {value: action.recipe.notes ? action.recipe.notes.value : initialState.notes.value, touched: false},
        },
            flavors: loadedFlavors,
            key: action.key
    })
};



export default reducer;