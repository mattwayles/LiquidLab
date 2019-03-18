import * as actionTypes from './actionTypes';

export const saveInventoryDataRedux = (inventory) => {
    return {
        type: actionTypes.SAVE_INVENTORY_DATA_REDUX,
        base: inventory.base,
        flavors: inventory.flavors
    }
};

export const saveShoppingListRedux = (cutoff, shoppingList) => {
    return {
        type: actionTypes.SAVE_SHOPPING_LIST_REDUX,
        cutoff,
        shoppingList
    }
};

export const modifyFlavorRecipeCountRedux = (inventory) => {
    return {
        type: actionTypes.MODIFY_FLAVOR_RECIPE_COUNT_REDUX,
        inventory
    }
};

export const clearInventory = () => {
    return {
        type: actionTypes.CLEAR_INVENTORY_REDUX
    }
};