import {compareFlavors, createNextId, enforceInputConstraints} from "./shared";

/**
 * Sort the inventory table base on column and direction
 * @param flavors   The list of inventory flavors
 * @param column    The column to be sorted
 * @param sort  The sort direction
 * @returns {{flavors: (*[]|*), sort: {col: *, asc: boolean}}}
 */
export const sortTable = (flavors, column, sort) => {
    let preSort = [...flavors];
    let emptyCell = [];
    let postSort;
    let newSort;

    for (let i = 0; i < preSort.length; i++) {
        if (!preSort[i][column]) {
            if (column !== "amount" && preSort[i][column] !== 0) {
                let row = preSort.splice(i, 1);
                emptyCell.push(row[0]);
            }
        }
    }

    if (sort.col !== column) {
        newSort = {col: column, asc: true};
    }
    else {
        newSort = {col: sort.col, asc: !sort.asc };
    }

    if (newSort.asc) {
        preSort = preSort.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            if (column !== "amount" && column !== 'recipes') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            else {
                aVal = parseInt(aVal, 10);
                bVal = parseInt(bVal, 10);
            }
            return (aVal > bVal) ? 1 : ((bVal > aVal) ? -1 : 0)
        });
    }
    else {
        preSort = preSort.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            if (column !== "amount" && column !== 'recipes') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            else {
                aVal = parseInt(aVal, 10);
                bVal = parseInt(bVal, 10);
            }
            return (aVal < bVal) ? 1 : ((bVal < aVal) ? -1 : 0)
        });
    }

    postSort = [...preSort, ...emptyCell];
    return {flavors: postSort, sort: newSort};

};

/**
 * Populate the shopping list on mount from low-inventory items
 * @param shoppingList  The current shopping list
 * @param flavors   A list of inventory flavors
 * @param cutoff    The ML cutoff to stop accepting flavors as low-inventory
 * @returns {*}
 */
export const populateShoppingList = (shoppingList, flavors, cutoff) => {
    let list = shoppingList ? [...shoppingList] : [];
    for (let i in flavors) {
        const flavor = flavors[i];

        if ((flavor.amount || flavor.amount === 0) && parseFloat(flavor.amount.toString()) <= parseFloat(cutoff) && !duplicateFlavor(flavor.vendor, flavor.name, list)) {
            list = [...list,
                {id: createNextId(list), vendor: flavor.vendor, name: flavor.name, auto: true}];
        }
    }
    return list.sort((a, b) => {
        return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0)
    });
};

export const duplicateFlavor = (vendor, name, flavors) => {
    for (let i in flavors) {
        if (flavors[i].name === name && flavors[i].vendor === vendor) {
            return true;
        }
    }
    return false;
};

/**
 * Custom user input handling for inventory Input objects
 * @param e The user input event
 * @param row   The row receiving the event
 * @param control   The control receiving the event
 * @param list  The flavor/input list
 * @returns {*[]}
 */
export const userInput = (e, row, control, list) => {
    e.target.value = enforceInputConstraints(e.target.value, e.target.maxLength);
    let data = [...list];
    for (let flavor in data) {
        if (data[flavor].id === row.id) {
            if (control === 'amount') {
                if (e.keyCode === 8 || e.keyCode === 190 || (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106)) {
                    if (window.getSelection().toString().length) {
                        const newStr = e.target.value.slice(0, e.target.value.length - window.getSelection().toString().length);
                        data[flavor] = {...data[flavor], [control]: newStr};
                    }
                    else if (e.keyCode === 8) {
                        data[flavor] = {...data[flavor], [control]: e.target.value.slice(0, -1)};
                    }

                    let newVal = (e.keyCode === 8) ? data[flavor][control] : data[flavor][control] + e.key;

                    data[flavor] = {...data[flavor], [control]: newVal};
                }
            }
            else {
                if ((e.keyCode > 47 && e.keyCode < 91 && !e.ctrlKey) || (e.keyCode > 95 && e.keyCode < 106) ||
                    e.keyCode === 8 || e.keyCode === 32 || e.keyCode > 145) {
                    console.log(window.getSelection().toString().length);
                    if (window.getSelection().toString().length) {
                        const newStr = e.target.value.slice(0, e.target.value.length - window.getSelection().toString().length);
                        data[flavor] = {...data[flavor], [control]: newStr};
                    }
                    else if (e.keyCode === 8) {
                        console.log(e.target.value);
                        data[flavor] = {...data[flavor], [control]:  e.target.value.slice(0, -1)};
                    }

                    let newVal = (e.keyCode === 8) ? data[flavor][control] : data[flavor][control] + e.key;

                    data[flavor] = {...data[flavor], [control]: newVal};
                }
            }
        }
    }
    return data;
};

/**
 * When creating a new inventory item, determine if its included in any existing database recipes
 * @param newFlavors    The list of new Inventory flavors
 * @param oldFlavors    The existing Inventory flavors
 * @param recipes   The user recipes available in Redux
 * @returns {*}
 */
export const detectRecipeInclusion = (newFlavors, oldFlavors, recipes) => {
    for (let f in newFlavors) {
        if (oldFlavors.indexOf(newFlavors[f]) === -1) {
            for (let r in recipes) {
                for (let rf in recipes[r].flavors) {
                    if (compareFlavors(recipes[r].flavors[rf], newFlavors[f])) {
                        newFlavors[f].recipes++;
                    }
                }
            }
        }
    }
    return newFlavors;
};