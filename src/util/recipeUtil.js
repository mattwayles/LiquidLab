import {calculateFlavorResults} from "./formulaUtil";
import {compareFlavors} from "./shared";
import RecipeControl from "../components/RecipeControl/RecipeControl";
import React from "react";

export const updateFlavors = (event, flavors, input, weights, inventory, mlToMakeVal) => {
    let exists = false;
    let updatedFlavors = [...flavors];
    for(let i = 0; i < updatedFlavors.length; i++) {
        if (updatedFlavors[i].control === event.target.id) {
            let updatedFlavor = {
                ...updatedFlavors[i],
                [event.target.name]: {value: event.target.value, touched: true}};
            exists = true;
            if (event.target.name === 'percent') {
                const valid = setInvalidFlavor(updatedFlavor, input, weights, inventory, mlToMakeVal).valid;
                updatedFlavor = {...updatedFlavor, valid: valid};
            }
            updatedFlavors[i] = updatedFlavor;
        }
    }
    if (!exists) {
        updatedFlavors.push({
            control: event.target.id,
            [event.target.name]: {value: event.target.value, touched: true}})
    }
    return updatedFlavors;
};

export const setInvalidRecipes = (recipes, inputs, weights, inventory, mlToMake) => {
    let filteredRecipes = {...recipes};

    for (let r in recipes) {
        let recipe = recipes[r];
        //For each flavor in recipe
        for (let f in recipe.flavors) {
            const flavor = setInvalidFlavor(recipe.flavors[f], inputs, weights, inventory, mlToMake);
            if (!flavor.valid) {
                recipe = {...recipe, invalid: true, flavors: [...recipe.flavors, flavor]};
            }
            else {
                recipe = {...recipe, flavors: [...recipe.flavors, flavor]}
            }
            filteredRecipes = {...filteredRecipes, [r]: recipe};
        }
    }
    return filteredRecipes;
};

export const setInvalidFlavor = (flavor, inputs, weights, inventory, mlToMake) => {
    let mlRequired = calculateFlavorResults({...inputs, mlToMake: {value: mlToMake}}, weights, flavor).ml;
    let mlInventory = 0;
    for (let i in inventory) {
        if(compareFlavors(flavor, inventory[i])) {
            mlInventory = inventory[i].amount;
        }
    }

    if (parseFloat(mlRequired.toString()) > parseFloat(mlInventory.toString())) {
        return {...flavor, valid: false};
    }
    else {
        return {...flavor, valid: true};
    }
};

export const populateList = (displayOptions, filter, inventory) => {
    let list = [];
    for (let i in inventory) {
        if (displayOptions.ven.display) {
            if (inventory[i].vendor && filter.ven && inventory[i].vendor.toLowerCase().includes(filter.ven.toLowerCase())) {
                list.push(inventory[i].vendor)
            }
        }
        else if (displayOptions.name.display) {
            if (inventory[i].name && filter.name && inventory[i].name.toLowerCase().includes(filter.name.toLowerCase())) {
                list.push(inventory[i].name);
            }
        }
    }
    return list;
};

export const mapControls = (col1Controls, classes, recipeKey, recipes, flavors, input, weights, inventory, list, cursor, displayOptions,
    optionClickedHandler, plusClickedHandler, flavorDataEnteredHandler, optionHandler,  keyDownHandler, clicked) => {
    return col1Controls.map(control => {
        if (control.type === 'button') {
            return (
                <button
                    key="plusBtn"
                    disabled={flavors && flavors.length < 8}
                    className={flavors && flavors.length < 8 ? classes.PlusButtonDisabled : classes.PlusButton}
                    onClick={plusClickedHandler}
                >+</button>
            )
        }
        let valid = null;

        if (recipeKey) {
            let recipe = null;
            for (let r in recipes) {
                if (recipes[r].dbKey === recipeKey) {
                    recipe = recipes[r];
                }
            }
            if (recipe) {
                for (let i = 0; i < flavors.length; i++) {
                    if (parseInt(recipe.flavors[i].control, 10) === control.id) {
                        valid = setInvalidFlavor(flavors[i], input, weights, inventory,
                            input.mlToMake.value).valid;
                    }
                }
            }
        }
        else if (flavors) {

            for (let i = 0; i < flavors.length; i++) {
                if (+flavors[i].control === control.id) {
                    valid = flavors[i].valid !== false;
                }
            }
        }

        let readOnly = false;
        if (flavors && flavors.length < control.id) {
            readOnly = true;
        }

        return (<RecipeControl
            readOnly={readOnly}
            values={flavors ? flavors[control.id] : null}
            key={control.id}
            id={control.id}
            valid={valid}
            optionClick={optionClickedHandler}
            plusClicked={plusClickedHandler}
            change={flavorDataEnteredHandler}
            keyDown={keyDownHandler}
            display={displayOptions}
            focus={optionHandler}
            blur={optionHandler}
            calculate={clicked}
            list={list}
            cursor={cursor}
        />);
    });
};