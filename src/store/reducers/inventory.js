import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/shared.js';

const initialState = {
    flavors: [],
    shoppingList: [],
    loading: false,
    error: false

};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SAVE_FLAVOR_DATA_REDUX: return updateObject(state, { flavors: action.flavors });
        case actionTypes.SAVE_SHOPPING_LIST_REDUX: return updateObject(state, { shoppingList: action.shoppingList });
        case actionTypes.GET_USER_INVENTORY_START: return updateObject(state, { loading: true });
        case actionTypes.GET_USER_INVENTORY_SUCCESS: return updateObject(state, { flavors: action.flavors, loading: false });
        case actionTypes.GET_USER_INVENTORY_FAILED: return updateObject(state, { error: action.error, loading: false });
        case actionTypes.GET_USER_SHOPPING_LIST_START: return updateObject(state, { loading: true });
        case actionTypes.GET_USER_SHOPPING_LIST_SUCCESS: return updateObject(state, { shoppingList: action.shoppingList, loading: false });
        case actionTypes.GET_USER_SHOPPING_LIST_FAILED: return updateObject(state, { error: action.error, loading: false });
        default: return {...state}
    }
};



export default reducer;