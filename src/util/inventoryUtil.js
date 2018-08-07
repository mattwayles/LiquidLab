export const sortTable = (flavors, column, sort) => {
    let preSort = [...flavors];
    let emptyCell = [];
    let postSort;
    let newSort;

    for (let i = 0; i < preSort.length; i++) {
        if (!preSort[i][column]) {
            if (!(column === "amount" && preSort[i][column] === 0)) {
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
        console.log(preSort);
        preSort = preSort.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            if (column !== "amount") {
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
            if (column !== "amount") {
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