import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/shared.js';

const initialState = {
    cutoff: 3,
    flavors: [],
    shoppingList: [],
    loading: false,
    error: false

};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SAVE_FLAVOR_DATA_REDUX: return updateObject(state, { flavors: action.flavors });
        case actionTypes.MODIFY_FLAVOR_RECIPE_COUNT_REDUX: return updateObject(state, { flavors: action.inventory, loading: false });
        case actionTypes.SAVE_SHOPPING_LIST_REDUX: return updateObject(state, { cutoff: action.cutoff, shoppingList: action.shoppingList });
        case actionTypes.GET_USER_INVENTORY_START: return updateObject(state, { loading: true });
        case actionTypes.GET_USER_INVENTORY_SUCCESS: return updateObject(state, { flavors: action.flavors, loading: false });
        case actionTypes.GET_USER_INVENTORY_FAILED: return updateObject(state, { error: action.error, loading: false });
        case actionTypes.GET_USER_SHOPPING_LIST_START: return updateObject(state, { loading: true });
        case actionTypes.GET_USER_SHOPPING_LIST_SUCCESS: return updateObject(state, { cutoff: action.cutoff ? action.cutoff : initialState.cutoff,
            shoppingList: action.shoppingList, loading: false });
        case actionTypes.GET_USER_SHOPPING_LIST_FAILED: return updateObject(state, { error: action.error, loading: false });
        case actionTypes.CLEAR_INVENTORY_REDUX: return updateObject(state, initialState);
        default: return {...state}
    }
};

export default reducer;