import React, { Component } from 'react';
import * as actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import { enforceInputConstraints } from '../../../../util/shared';
import * as ToolTip from '../../../../constants/Tooltip';

import Auxil from '../../../../hoc/Auxil';
import TargetControl from '../../../../components/TargetControl/TargetControl';
import classes from './Target.css';
import {validateTargetInput} from "../../../../util/formulaUtil";

class Target extends Component {

    /**
     * Handle user input entered into Target components
     * @param event The user input event
     * @param control   The control receiving the user input
     */
    dataEnteredHandler = (event, control) => {
        event.target.value = enforceInputConstraints(event.target.value, event.target.maxLength);

        let valid = this.props.isAuthenticated ? this.validateSufficientInventory(event, control) : true;

        if (control === 'targetPg' || control === 'targetVg') {
            const oppControl = control === 'targetPg' ? 'targetVg' : 'targetPg';
            const sum = +event.target.value + +this.props.inputs[oppControl].value;
            valid = valid && (sum === 100 || sum === 0);
            this.props.onDataEntered(oppControl, this.props.inputs[oppControl].value, valid);
        }

        this.props.onDataEntered(control, event.target.value, valid);
    };

    /**
     * Validate current input data for authenticated users only
     * @param event The user input event
     * @param control The control receiving the user input
     */
    validateSufficientInventory = (event, control) => {
        let updatedInputs = {
            ...this.props.inputs,
            [control]: {...this.props.inputs[control], value: event.target.value}
        };
        return validateTargetInput(control, updatedInputs, this.props.weights, this.props.flavors, this.props.baseInventory);
    };

    render() {
        const {targetNic, targetPg, targetVg, notes} = this.props.inputs;
        const baseSum = +targetPg.value + +targetVg.value === 100;

        let controls =
            <Auxil>
                <p className={classes.Header}>Target</p>
                <div className={classes.TargetGrid}>
                    <TargetControl
                        autoPopulate={!targetNic.touched && targetNic.value > 0}
                        value={targetNic.value !== undefined ? targetNic.value : ''}
                        valid={targetNic.valid}
                        tooltip={targetNic.valid ? ToolTip.TARGET_NIC : ToolTip.TARGET_SUFFICIENT_NIC_ERROR}
                        change={(event) => this.dataEnteredHandler(event, 'targetNic')}
                        label="Target Nic:"
                        type="number"
                        suffix="mg"
                        min="0"
                        maxLength="3" />
                    <TargetControl
                        autoPopulate={!targetPg.touched && targetPg.value > 0}
                        value={targetPg.value}
                        valid={targetPg.valid}
                        tooltip={targetPg.valid ? ToolTip.TARGET_PG : baseSum ? ToolTip.TARGET_SUFFICIENT_BASE_ERROR : ToolTip.TARGET_PG_ERROR}
                        change={(event) => this.dataEnteredHandler(event, 'targetPg')}
                        label="Target PG:"
                        type="number"
                        suffix="%"
                        min="0"
                        maxLength="3" />
                    <TargetControl
                        autoPopulate={!targetVg.touched &&targetVg.value > 0}
                        value={targetVg.value}
                        valid={targetVg.valid}
                        tooltip={targetVg.valid ? ToolTip.TARGET_VG : baseSum ? ToolTip.TARGET_SUFFICIENT_BASE_ERROR : ToolTip.TARGET_VG_ERROR}
                        change={(event) => this.dataEnteredHandler(event, 'targetVg')}
                        label="Target VG:"
                        type="number"
                        suffix="%"
                        min="0"
                        maxLength="3" />
                </div>
                <textarea data-tip={ToolTip.NOTES}
                    value={notes.value}
                          className={!notes.touched && notes.value !== '' ? classes.TextAreaAuto : classes.TextArea}
                          onChange={(event) => this.dataEnteredHandler(event, 'notes')}
                          placeholder="Notes" />
            </Auxil>;
        return (
            <div className={classes.Target}>
                {controls}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        inputs: state.formula.inputs,
        flavors: state.formula.flavors,
        weights: state.formula.weights,
        baseInventory: state.inventory.base
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDataEntered: (control, value, valid) => dispatch(actions.inputDataEntered(control, value, valid))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Target);