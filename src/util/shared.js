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