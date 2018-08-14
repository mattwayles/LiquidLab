/**
 * Update state with a new object
 * @param oldObject The old sate object
 * @param updatedProps  The updated properties
 * @returns {{}}
 */
export const updateObject = (oldObject, updatedProps) => {
    return {
        ...oldObject,
        ...updatedProps
    }
};

/**
 * Ensure all inputs stay within their supplied constraints
 * @param value The input value
 * @param maxLength The max input length
 * @returns {*}
 */
export const enforceInputConstraints = (value, maxLength) => {
    let valArr = value.split("");
    if (valArr.indexOf("-") !== -1) {
        valArr.splice(value.indexOf("-"), 1);
    }

    value = valArr.join("");

    if (maxLength >= 0) {
        return value.slice(0, maxLength)
    }
    else {
        return value;
    }
};

/**
 * Determine if a recipe flavor is equal to an inventory flavor
 * @param flavor1   The recipe flavor
 * @param flavor2   The inventory flavor
 * @returns {boolean|*|Recipe.state.displayOptions.ven|{row, display}}
 */
export const compareFlavors = (flavor1, flavor2) => {
    return ((!flavor1.ven && flavor1.flavor && flavor1.flavor.value === flavor2.name) || (flavor1.ven && flavor1.ven.value === flavor2.vendor
        && flavor1.flavor && flavor1.flavor.value === flavor2.name));
};

/**
 * Compare a recipe result to an inventory flavor
 * @param flavor1   The recipe result
 * @param flavor2   The inventory flavor
 * @returns {boolean}
 */
export const compareResults = (flavor1, flavor2) => {
    return ((!flavor1.ven && flavor1.flavor === flavor2.name) || (flavor1.ven === flavor2.vendor && flavor1.flavor === flavor2.name));
};

/**
 * Manage flavor IDs
 * @param list  The list of objects being appended
 * @returns {number}
 */
export const createNextId = (list) => {
    let idList = [];
    if (list.length > 0) {
        for (let o in list) {
            idList.push(list[o].id);
        }
        return Math.max(...idList) + 1;
    }
    else {
        return 0;
    }


};

/**
 * Round all numbers to 2 decimal places
 * @param num   The number to be rounded
 * @returns {number}
 */
export const round = (num) => {
    return Math.round((num) * 100) /100;
};