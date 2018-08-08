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