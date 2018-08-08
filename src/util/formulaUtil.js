export const round = (formula) => {
    return Math.round((formula) * 100) /100;
};

export const validateInputs = (inputs, flavors, error) => {
    if (inputs.name.value === "") {
        error("Please enter a recipe name");
        return false;
    }
    else if (inputs.mlToMake.value < 1) {
        error("ML To Make must be greater than or equal to 1");
        return false;
    }
    else if (inputs.targetNic.value < 0) {
        error("Target NIC must be greater than or equal to 0");
        return false;
    }
    else if (+inputs.targetPg.value + +inputs.targetVg.value !== 100) {
        error("Target PG and Target VG must equal 100%");
        return false;
    }
    else {
        if (flavors) {
            for (let i = 0; i < flavors.length; i++) {
                if (!flavors[i].percent || !flavors[i].percent.value > 0) {
                    error("Each added flavor must contain a percentage greater than zero");
                    return false;
                }
            }
        }
    }
    return true;
};

export const formulaIsEmpty = (inputs, flavors) => {
    for (let prop in inputs) {
        if (inputs[prop].value !== '') {
            return false;
        }
    }

    if (flavors.length > 0) {
        for (let i in flavors) {
            if (flavors[i].ven && flavors[i].ven.value !== '') {
                return false;
            }
            if (flavors[i].flavor && flavors[i].flavor.value !== '') {
                return false;
            }
            if (flavors[i].percent && flavors[i].percent.value !== '') {
                return false;
            }
        }
    }
    return true;
};

export const mapInputs = (inputs, weights) => {
    return {
        mlToMake: parseInt(inputs.mlToMake.value, 10),
        inputNic: inputs.targetNic.value ? parseInt( inputs.targetNic.value, 10) : 0,
        inputPg: inputs.targetPg.value / 100,
        inputVg: inputs.targetVg.value / 100,
        nicStrength: weights.nicStrength,
        nicBasePg: weights.nicBasePg / 100,
        nicBaseVg: weights.nicBaseVg / 100,
        flavorWeight: weights.flavorWeight,
        nicWeight: weights.nicWeight,
        pgWeight: weights.pgWeight,
        vgWeight: weights.vgWeight
    }
};

export const calcBaseResults = (inputs, weights, flavorMlTotal) => {
    const input = mapInputs(inputs, weights);
    const targetNic = round(input.mlToMake * input.inputNic);
    const pgTarget = round(input.mlToMake * input.inputPg - targetNic * input.nicBasePg);
    const vgTarget = round(input.mlToMake * input.inputVg - targetNic * input.nicBaseVg);
    const nicMl = round(input.mlToMake / input.nicStrength * input.inputNic);
    const pgMl = round(pgTarget - (nicMl - targetNic) * input.nicBasePg - flavorMlTotal);
    const vgMl = round(vgTarget - (nicMl - targetNic) * input.nicBaseVg);
    return {
        ...input,
        nicMl: nicMl,
        pgMl: pgMl,
        vgMl: vgMl,
        nicGrams: round(nicMl * input.nicWeight),
        pgGrams: round(pgMl * input.pgWeight),
        vgGrams: round(vgMl * input.vgWeight),
        nicPercent: round(nicMl / input.mlToMake * 100),
        pgPercent: round(pgMl / input.mlToMake * 100),
        vgPercent: round(vgMl / input.mlToMake * 100)
    }
};

export const calculateFlavorResults = (inputs, weights, flavor) => {
    const input = mapInputs(inputs, weights);
    const flavorMl = round(input.mlToMake * flavor.percent.value / 100);
    const flavorGrams = round(flavorMl * input.flavorWeight);

    return {
        ven: flavor.ven ? flavor.ven.value : '',
        flavor: flavor.flavor.value,
        ml: flavorMl,
        grams: flavorGrams,
        percent: flavor.percent.value
    }
};

export const validateBaseResults = (baseResults, update, error) => {
    if (baseResults.pgPercent >= 0) {
        update('pg', {ml: baseResults.pgMl, grams: baseResults.pgGrams, percent: baseResults.pgPercent})
    }
    else {
        error("This recipe does not contain enough PG for the target ratio");
        return false; }

    if (baseResults.vgPercent >= 0) {
        update('vg', {ml: baseResults.vgMl, grams: baseResults.vgGrams, percent: baseResults.vgPercent}) }
    else {
        error("This recipe does not contain enough VG for the target ratio");
        return false; }

        if (baseResults.nicPercent >= 0) {
        update('nic', {ml: baseResults.nicMl, grams: baseResults.nicGrams, percent: baseResults.nicPercent}) }
    else {
        error("This recipe does not contain enough NIC for the target amount");
        return false; }
        return true;
};

export const duplicateRecipe = (name, batch, recipes) => {
    for (let i in recipes) {
        if (recipes[i].name && recipes[i].name.value === name
        && recipes[i].batch && recipes[i].batch.value === batch) {
            return true;
        }
    }
    return false;
};

export const setInvalidRecipes = (recipes, inputs, weights, inventory, mlToMake) => {
    let filteredRecipes = {...recipes};

    for (let r in recipes) {
        let recipe = recipes[r];
        //For each flavor in recipe
        for (let f in recipe.flavors) {
            let flavor = recipe.flavors[f];

            //calculateFlavorResults
            let mlRequired = calculateFlavorResults({...inputs, mlToMake: {value: mlToMake}}, weights, flavor).ml;

            let mlInventory = 0;
            for (let i in inventory) {
                if (flavor.ven && flavor.ven.value === inventory[i].vendor
                    && flavor.flavor && flavor.flavor.value === inventory[i].name) {
                    mlInventory = inventory[i].amount;
                }
            }
            if (parseFloat(mlRequired) > parseFloat(mlInventory.toString())) {
                flavor = {...flavor, valid: false};
                recipe = {...recipe, invalid: true, flavors: [...recipe.flavors, flavor]};
                filteredRecipes = {...filteredRecipes, [r]: recipe};
            }
        }
    }
    return filteredRecipes;
};