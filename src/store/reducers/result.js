import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility.js';

const initialState = {
    ingredients : {
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
        }]
    },
    recipeInfo: {
        notes: null,
        name: null,
        batch: null
    }
};

const reducer = (state = initialState, action) => {
    if (action.type === actionTypes.UPDATE_INGREDIENTS) {
        const updatedIngredients = updateObject(state.ingredients, {[action.control]: action.value});
        return updateObject(state, {ingredients: updatedIngredients});
    }
    if (action.type === actionTypes.UPDATE_RECIPE_INFO) {
        const updatedInfo = updateObject(state.recipeInfo, {[action.control]: action.value});
        return updateObject(state, {inputs: updatedInfo});
    }
    return initialState;
};


export default reducer;