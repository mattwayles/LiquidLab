import {calculateFlavorResults} from "./formulaUtil";
import {compareFlavors} from "./shared";
import RecipeControl from "../components/RecipeControl/RecipeControl";
import React from "react";
import ReactTooltip from 'react-tooltip';
import * as ToolTip from '../constants/Tooltip';

/**
 * When user flavor input is received, update flavor data
 * @param event The user input event
 * @param flavors   The current list of recipe flavors
 * @param input The user input object
 * @param weights   The ingredient weights
 * @param inventory The current flavor inventory
 * @param mlToMakeVal   The MLToMake value
 * @returns {*[]}
 */
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

/**
 * Determine if a recipe cannot be made based on inventory requirements
 * @param recipes   The list of user recipes
 * @param inputs    The user inputs for the current recipe
 * @param weights   The ingredient weights
 * @param inventory The current flavor inventory
 * @param mlToMake  The volume of liquid to be made
 * @returns {{}}
 */
export const setInvalidRecipes = (recipes, inputs, weights, inventory, mlToMake) => {
    let filteredRecipes = [...recipes];

    for (let r in recipes) {
        let recipe = {...recipes[r], invalid: false};
        //For each flavor in recipe
        for (let f in recipe.flavors) {
            const flavor = setInvalidFlavor(recipe.flavors[f], inputs, weights, inventory, mlToMake);
            if (!flavor.valid) {
                recipe = {...recipe, invalid: true};

            }
            filteredRecipes[r] = recipe;
        }
    }
    return filteredRecipes;
};

/**
 * Determine if a flavor cannot be used in a recipe based on inventory requirements
 * @param flavor   The flavor being checked for validity
 * @param inputs    The user inputs for the current recipe
 * @param weights   The ingredient weights
 * @param inventory The current flavor inventory
 * @param mlToMake  The volume of liquid to be made
 * @returns {{}}
 */
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

/**
 * Provide a drop-down of input options from inventory when inputting recipe flavors
 * @param displayOptions    The full list of input options
 * @param filter    The curent filter string
 * @param inventory The list of Inventory flavors
 * @returns {Array}
 */
export const populateList = (displayOptions, filter, inventory) => {
    let list = [];
    for (let i in inventory) {
        if (displayOptions.ven.display) {
            if (inventory[i].vendor && filter.ven && inventory[i].vendor.toLowerCase().startsWith(filter.ven.toLowerCase())) {
                list.push(inventory[i].vendor)
            }
        }
        else if (displayOptions.name.display) {
            if (inventory[i].name && filter.name && inventory[i].name.toLowerCase().startsWith(filter.name.toLowerCase())) {
                list.push(inventory[i].name);
            }
        }
    }

    return Array.from(new Set(list)).sort();
};

/**
 * Map flavor controls to the LiquidLab container
 * @param col1Controls  The column controls
 * @param classes   The CSS classes
 * @param recipeKey The recipe key
 * @param recipes   The list of a ll user recipes
 * @param flavors   The list of all flavors
 * @param input The current user input
 * @param weights   The ingredient weights
 * @param inventory The current flavor inventory
 * @param list  The InputOption list
 * @param cursor    The cursor value
 * @param displayOptions    The filtered display options
 * @param optionClickedHandler  Handler for clicking an InputOption
 * @param plusClickedHandler    Handler for clicking the column + button
 * @param flavorDataEnteredHandler  Handler for entering flavor data
 * @param optionHandler Handler for providing inputOptions
 * @param keyDownHandler    Handler for pressing keys in an InputOption
 * @param clicked   Handler for a mouse click
 * @param auth The user's authentication status
 * @returns {*}
 */
export const mapControls = (col1Controls, classes, recipeKey, recipes, flavors, input, weights, inventory, list, cursor, displayOptions,
    optionClickedHandler, plusClickedHandler, flavorDataEnteredHandler, optionHandler,  keyDownHandler, clicked, auth) => {

    let disabled = flavors && flavors.length < 8;
    return col1Controls.map(control => {
        if (control.type === 'button') {
            return (
                <span key="plusBtn" data-tip={disabled ? ToolTip.PLUS_BUTTON_DISABLED : ToolTip.PLUS_BUTTON}>
                    <button
                            disabled={disabled}
                            className={disabled ? classes.PlusButtonDisabled : classes.PlusButton}
                            onClick={plusClickedHandler}
                    >+</button>
                    <ReactTooltip delayShow={500}/>
                </span>
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
                    if (recipe.flavors[i]) {
                        if (parseInt(recipe.flavors[i].control, 10) === control.id) {
                            valid = setInvalidFlavor(flavors[i], input, weights, inventory,
                                input.mlToMake.value).valid;
                        }
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
            valid={auth ? valid : true}
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