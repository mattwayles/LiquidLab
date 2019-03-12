import React from 'react';
import classes from './Button.css';
import Auxil from "../../../hoc/Auxil";
import ReactTooltip from 'react-tooltip';

/**
 * A standard LiquidLab button
 * @param props
 * @returns {*}
 */
const button = (props) => {
    let classname = null;
    switch (props.classname) {
        case "Main":
            classname = classes.MainButton;
            break;
        case "Results":
            classname= classes.ResultsButton;
            break;
        case "Weights":
            classname = classes.WeightsButton;
            break;
        case "Browse":
            classname = classes.BrowseButton;
            break;
        case "Round":
            classname = classes.RoundButton;
            break;
        default:
            classname = classes.Button;
    }
    return(
        <Auxil>
            <span data-tip={props.tooltip}>
                <button
                    className={classname}
                    disabled={props.disabled}
                    onClick={props.clicked}
                >
                    {props.children}
                </button>
            </span>
            <ReactTooltip delayShow={500}/>
        </Auxil>
    )};

export default button;