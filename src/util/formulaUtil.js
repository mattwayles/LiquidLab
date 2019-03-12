import {compareFlavors, createNextId, round} from "./shared";

/**
 * Ensure all required Input objects are populated with valid values before attempting to calculate
 * @param inputs    The user inputs
 * @param flavors   The list of user-input flavors
 * @param error The error to return
 * @returns {boolean}   Boolean indicating the validity of all input values
 */
export const validateInputs = (inputs, flavors, error) => {
    if (inputs.mlToMake.value < 1) {
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

/**
 * Determine whether any user input has occurred in the main Input objects
 * @param inputs    The user inputs
 * @param flavors   The user-supplied flavors
 * @returns {boolean}   Boolean indicating formula emptiness
 */
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

/**
 * Map user inputs to variables
 * @param inputs    User inputs
 * @param weights   Ingredient weights
 * @returns An object containing all inputs, ready for calculation
 */
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

/**
 * Calculate the recipe results for base (target) ingredients
 * @param inputs    The user inputs for formula ingredients
 * @param weights   The ingredient weights
 * @param flavorMlTotal The total flavor ML expected in the recipe
 * @returns The base ingredient results
 */
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

/**
 * Calculate recipe results for flavor information
 * @param inputs    The user inputs for formula flavors
 * @param weights   The flavor weights
 * @param flavor    The current flavor being calculated
 * @returns     Flavor recipe results
 */
export const calculateFlavorResults = (inputs, weights, flavor) => {
    const input = mapInputs(inputs, weights);
    const flavorMl = flavor.percent ? round(input.mlToMake * flavor.percent.value / 100) : 0;
    const flavorGrams = round(flavorMl * input.flavorWeight);

    return {
        ven: flavor.ven ? flavor.ven.value : '',
        flavor: flavor.flavor ? flavor.flavor.value : '',
        ml: flavorMl,
        grams: flavorGrams,
        percent: flavor.percent ? flavor.percent.value : 0
    }
};

/**
 * Ensure all results are valid, positive nubmers before displaying them
 * @param baseResults   The results of the base ingredients
 * @param update    The updateRecipe function
 * @param error The error function
 * @returns {boolean}   Boolean determining the validity of all results
 */
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

/**
 * Verify that a recipe does not already exist in the database
 * @param name  The recipe name
 * @param batch The reipce batch
 * @param recipes   The list of recipes available in Redux
 * @returns {boolean}   Boolean determining duplication
 */
export const duplicateRecipe = (name, batch, recipes) => {
    for (let i in recipes) {
        if (recipes[i].name && recipes[i].name.value === name
        && recipes[i].batch && recipes[i].batch.value === batch) {
            return true;
        }
    }
    return false;
};

/**
 * When saving a recipe, determine the non-inventoried flavors
 * @param nonInventory  The list of non-inventoried flavors present in the recipe
 * @param flavors   The total flavor list
 * @param inventory The flavor inventory
 * @returns {*[]}
 */
export const populateNonInventoriedFlavors = (nonInventory, flavors, inventory) => {
    let nonInventoriedFlavors = [...nonInventory];
    if (nonInventoriedFlavors.length === 0) {
        for (let f in flavors) {
            let found = false;
            for (let i in inventory) {
                if (compareFlavors(flavors[f], inventory[i])) {
                    found = true;
                }
            }
            if (!found && flavors[f].flavor && flavors[f].flavor.value !== "") {
                nonInventoriedFlavors.push(flavors[f]);
            }
        }
    }
    return nonInventoriedFlavors;
};

/**
 * Save or update a recipe, also verifying successful inventory update
 * @param nonInventoriedFlavors The list of non-inventoried flavors in the recipe
 * @param inventoryProps    The flavors included in the Redux inventory
 * @param flavors   The flavors in the recipe
 * @param inputs    The user inputs in the recipe
 * @param userRecipes   All user recipes available in Redux
 * @param recipeKey The recipe database key
 * @param token The user database token
 * @param dbEntryId The user database entry ID
 * @param error The error function
 * @param saveFlavorData    The saveFlavorData database function
 * @param updateRecipe  The updateRecipe database function
 * @param saveRecipe    The saveRecipe database function
 */
export const saveOrUpdateRecipe = (nonInventoriedFlavors, inventoryProps, flavors, inputs, userRecipes, recipeKey, token, dbEntryId,
                                   error, saveFlavorData, updateRecipe, saveRecipe) => {
    let inventory = [...inventoryProps];
    for (let f in nonInventoriedFlavors) {
        inventory.push({amount: 0, id: createNextId([...inventory]), name: nonInventoriedFlavors[f].flavor.value,
            vendor: nonInventoriedFlavors[f].ven ? nonInventoriedFlavors[f].ven.value : '', recipes: 0, notes: ''})
    }
    if (recipeKey) {
        let original = {};
        for (let r in userRecipes) {
            if (userRecipes[r].dbKey === recipeKey) {
                original = userRecipes[r]
            }
        }
        saveFlavorData(token, dbEntryId, inventory);
        updateRecipe(token, dbEntryId, recipeKey,
            {...inputs, flavors: [...flavors]
            }, inventory, original);
    }
    else {
        if (duplicateRecipe(inputs.name.value, inputs.batch.value, userRecipes)) {
            const nameBatch = inputs.batch.value ? inputs.name.value + " [" + inputs.batch.value + "]" : inputs.name.value;
            error("The recipe " + nameBatch + " already exists in the database.");
        }
        else {
            saveFlavorData(token, dbEntryId, inventory);
            saveRecipe(token, dbEntryId, inventory, {
                ...inputs,
                flavors: [...flavors]
            });
        }
    }
};