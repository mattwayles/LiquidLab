import * as actionTypes from './actionTypes';

export const saveFlavorDataRedux = (flavors) => {
    return {
        type: actionTypes.SAVE_FLAVOR_DATA_REDUX,
        flavors
    }
};

export const saveShoppingListRedux = (shoppingList) => {
    return {
        type: actionTypes.SAVE_SHOPPING_LIST_REDUX,
        shoppingList
    }
};