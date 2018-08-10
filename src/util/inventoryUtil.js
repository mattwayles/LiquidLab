import {createNextId, enforceInputConstraints} from "./shared";

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

export const userInput = (e, row, control, list) => {
    e.target.value = enforceInputConstraints(e.target.value, e.target.maxLength);
    let data = [...list];
    for (let flavor in data) {
        if (data[flavor].id === row.id) {
            if ((e.keyCode > 47 && e.keyCode < 91 && !e.ctrlKey) || (e.keyCode > 95 && e.keyCode < 106) ||
                e.keyCode === 8 || e.keyCode === 32) {
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
    }
    return data;
};