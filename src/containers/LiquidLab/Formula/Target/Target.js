import React, { Component } from 'react';
import * as actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import { enforceInputConstraints } from '../../../../util/shared';


import Auxil from '../../../../hoc/Auxil';
import TargetControl from '../../../../components/TargetControl/TargetControl';
import classes from './Target.css';

class Target extends Component {

    dataEnteredHandler = (event, control) => {
        event.target.value = enforceInputConstraints(event.target.value, event.target.maxLength);

        let valid = event.target.value >= 0;
        if (control === 'targetPg') {
            valid = +event.target.value + +this.props.targetVg.value === 100;
            this.props.onDataEntered('targetPg', event.target.value, valid);
            this.props.onDataEntered('targetVg', this.props.targetVg.value, valid);
        }
        else if (control === 'targetVg') {
            valid = +event.target.value + +this.props.targetPg.value === 100;
            this.props.onDataEntered('targetPg', this.props.targetPg.value, valid);
            this.props.onDataEntered('targetVg', event.target.value, valid);
        }
        else {
            this.props.onDataEntered(control, event.target.value, valid);
        }
    };

    render() {
        let controls =
            <Auxil>
                <p className={classes.Header}>Target</p>
                <div className={classes.TargetGrid}>
                    <TargetControl autoPopulate={!this.props.targetNic.touched && this.props.targetNic.value > 0} value={this.props.targetNic.value !== undefined ? this.props.targetNic.value : ''}
                                   valid={this.props.targetNic.valid} change={(event) => this.dataEnteredHandler(event, 'targetNic')}
                                   label="Target Nic:" type="number" suffix="mg" min="0" maxLength="3" />
                    <TargetControl autoPopulate={!this.props.targetPg.touched && this.props.targetPg.value > 0}  value={this.props.targetPg.value} valid={this.props.targetPg.valid}
                                   change={(event) => this.dataEnteredHandler(event, 'targetPg')}
                                   label="Target PG:" type="number" suffix="%" min="0" maxLength="3" />
                    <TargetControl autoPopulate={!this.props.targetVg.touched &&this.props.targetVg.value > 0}  value={this.props.targetVg.value} valid={this.props.targetVg.valid}
                                   change={(event) => this.dataEnteredHandler(event, 'targetVg')}
                                   label="Target VG:" type="number" suffix="%" min="0" maxLength="3" />
                </div>
                <textarea value={this.props.notes.value}
                          className={!this.props.notes.touched && this.props.notes.value !== '' ? classes.TextAreaAuto : classes.TextArea} onChange={(event) => this.dataEnteredHandler(event, 'notes')} placeholder="Notes" />
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
        mlToMake: state.formula.inputs.mlToMake,
        targetNic: state.formula.inputs.targetNic,
        targetPg: state.formula.inputs.targetPg,
        targetVg: state.formula.inputs.targetVg,
        notes: state.formula.inputs.notes
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDataEntered: (control, value, valid) => dispatch(actions.inputDataEntered(control, value, valid))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Target);