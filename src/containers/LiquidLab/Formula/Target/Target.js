import React, { Component } from 'react';
import * as actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import {enforceInputConstraints} from '../../../../util/shared';
import ReactTooltip from 'react-tooltip';
import * as ToolTip from '../../../../constants/Tooltip';

import Auxil from '../../../../hoc/Auxil';
import TargetControl from '../../../../components/TargetControl/TargetControl';
import classes from './Target.css';
import { checkBaseInputValidity } from "../../../../util/formulaUtil";

class Target extends Component {

    componentDidMount() {
        if (this.props.inputs.targetNic.value) { this.setValidity('targetNic', this.props.inputs.targetNic.value); }
        if (this.props.inputs.targetPg.value) { this.setValidity('targetPg', this.props.inputs.targetPg.value); }
        if (this.props.inputs.targetVg.value) { this.setValidity('targetVg', this.props.inputs.targetVg.value); }
    }

    /**
     * Handle user input entered into Target components
     * @param event The user input event
     */
    dataEnteredHandler = (event) => {
        event.target.value = enforceInputConstraints(event.target.value, event.target.maxLength);
        this.setValidity(event.target.name, event.target.value);
    };

    setValidity = (control, value) => {
        let valid = value >= 0 && checkBaseInputValidity(control, value, this.props.inputs.mlToMake.value,
            this.props.flavors, this.props.inputs, this.props.weights, this.props.baseInventory);

        this.props.onDataEntered(control, value, valid);

        if (control === 'targetPg') {
            this.props.onDataEntered('targetVg', this.props.inputs.targetVg.value, valid);
        }
        else if (control === 'targetVg') {
            this.props.onDataEntered('targetPg', this.props.inputs.targetPg.value, valid);
        }
    };

    render() {
        const {inputs} = this.props;
        
        
        const baseSum = +inputs.targetPg.value + +inputs.targetVg.value === 100;

        let controls =
            <Auxil>
                <p className={classes.Header}>Target</p>
                <div className={classes.TargetGrid}>
                    <TargetControl name="targetNic"
                        autoPopulate={!inputs.targetNic.touched && inputs.targetNic.value > 0}
                        value={inputs.targetNic.value !== undefined ? inputs.targetNic.value : ''}
                        valid={inputs.targetNic.valid}
                        tooltip={inputs.targetNic.valid ? ToolTip.TARGET_NIC : ToolTip.TARGET_NIC_ERROR}
                        change={(event) => this.dataEnteredHandler(event)}
                        label="Target Nic:"
                        type="number"
                        suffix="mg"
                        min="0"
                        maxLength="3" />
                    <TargetControl name="targetPg"
                        autoPopulate={!inputs.targetPg.touched && inputs.targetPg.value > 0}
                        value={inputs.targetPg.value}
                        valid={inputs.targetPg.valid}
                        tooltip={inputs.targetPg.valid ? ToolTip.TARGET_PG :
                            baseSum ? ToolTip.TARGET_INSUFFICIENT_ERROR : ToolTip.TARGET_PG_SUM_ERROR}
                        change={(event) => this.dataEnteredHandler(event)}
                        label="Target PG:"
                        type="number"
                        suffix="%"
                        min="0"
                        maxLength="3" />
                    <TargetControl name="targetVg"
                        autoPopulate={!inputs.targetVg.touched &&inputs.targetVg.value > 0}
                        value={inputs.targetVg.value}
                        valid={inputs.targetVg.valid}
                        tooltip={inputs.targetVg.valid ? ToolTip.TARGET_VG :
                            baseSum ? ToolTip.TARGET_INSUFFICIENT_ERROR : ToolTip.TARGET_VG_SUM_ERROR}
                        change={(event) => this.dataEnteredHandler(event)}
                        label="Target VG:"
                        type="number"
                        suffix="%"
                        min="0"
                        maxLength="3" />
                </div>
                <textarea data-tip={ToolTip.NOTES}
                    value={inputs.notes.value}
                          className={!inputs.notes.touched && inputs.notes.value !== '' ? classes.TextAreaAuto : classes.TextArea}
                          onChange={(event) => this.dataEnteredHandler(event, 'notes')}
                          placeholder="Notes" />
                <ReactTooltip type={"dark"} delayShow={500}/>
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
        inputs: state.formula.inputs,
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