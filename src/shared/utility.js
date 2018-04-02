export const updateObject = (oldObject, updatedProps) => {
    return {
        ...oldObject,
        ...updatedProps
    }
};

export const enforceMaxLength = (value, maxLength) => {
    if (maxLength >= 0) {
        return value.slice(0, maxLength)
    }
    else {
        return value;
    }
};