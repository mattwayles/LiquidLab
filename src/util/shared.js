export const updateObject = (oldObject, updatedProps) => {
    return {
        ...oldObject,
        ...updatedProps
    }
};

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

export const compareFlavors = (flavor1, flavor2) => {
    return ((!flavor1.ven && flavor1.flavor && flavor1.flavor.value === flavor2.name) || (flavor1.ven && flavor1.ven.value === flavor2.vendor
        && flavor1.flavor && flavor1.flavor.value === flavor2.name));
};

export const compareResults = (flavor1, flavor2) => {
    return ((!flavor1.ven && flavor1.flavor === flavor2.name) || (flavor1.ven === flavor2.vendor && flavor1.flavor === flavor2.name));
};

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

export const getNextId = (list, curr) => {
    let idList = [];
    for (let o in list) {
        idList.push(list[o].id);
    }

    return idList[idList.indexOf(curr) + 1];
};

export const round = (num) => {
    return Math.round((num) * 100) /100;
};