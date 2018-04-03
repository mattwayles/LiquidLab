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
    switch (action.type) {
        case actionTypes.UPDATE_INGREDIENTS:
            const updatedIngredients = updateObject(state.ingredients, {[action.control]: action.value});
            return updateObject(state, {ingredients: updatedIngredients});
        case actionTypes.UPDATE_RECIPE_INFO:
            const updatedInfo = updateObject(state.recipeInfo, {[action.control]: action.value});
            return updateObject(state, {recipeInfo: updatedInfo});
        case actionTypes.INPUT_DATA_ENTERED: return {...state};
        case actionTypes.RECIPE_DATA_ENTERED: return {...state};
        default: return initialState;
    }
};


export default reducer;