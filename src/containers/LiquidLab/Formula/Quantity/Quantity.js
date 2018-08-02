import React, { Component } from 'react';
import * as actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import { enforceMaxLength } from '../../../../util/shared';


import Auxil from '../../../../hoc/Auxil';
import QuantityControl from '../../../../components/QuantityControl/QuantityControl';
import classes from './Quantity.css';

class Quantity extends Component {

    dataEnteredHandler = (event, control) => {
        event.target.value = enforceMaxLength(event.target.value, event.target.maxLength);

        let valid = event.target.value >= 0;
        if (control === 'mlToMake') {
            valid = event.target.value >= 1;
            this.props.onDataEntered('mlToMake', this.props.mlToMake.value, valid);
        }
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
    }

    render() {
        let controls =
            <Auxil>
                <p className={classes.Header}>Quantity</p>
                <div className={classes.QuantityGrid}>
                    <QuantityControl value={this.props.mlToMake.value} valid={this.props.mlToMake.valid}
                                     change={(event) => this.dataEnteredHandler(event, 'mlToMake')} label="ML To Make:" type="number" suffix="ml" maxLength="4" autofocus />
                    <QuantityControl value={this.props.targetNic.value} valid={this.props.targetNic.valid}
                                     change={(event) => this.dataEnteredHandler(event, 'targetNic')} label="Target Nic:" type="number" suffix="mg" maxLength="3" />
                    <QuantityControl value={this.props.targetPg.value} valid={this.props.targetPg.valid}
                                     change={(event) => this.dataEnteredHandler(event, 'targetPg')} label="Target PG:" type="number" suffix="%" maxLength="3" />
                    <QuantityControl value={this.props.targetVg.value} valid={this.props.targetVg.valid}
                                     change={(event) => this.dataEnteredHandler(event, 'targetVg')} label="Target VG:" type="number" suffix="%" maxLength="3" />
                </div>
                <textarea className={classes.TextArea} onChange={(event) => this.dataEnteredHandler(event, 'notes')} placeholder="Notes" />
            </Auxil>;
        return (
            <div className={classes.Quantity}>
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

export default connect(mapStateToProps,mapDispatchToProps)(Quantity);