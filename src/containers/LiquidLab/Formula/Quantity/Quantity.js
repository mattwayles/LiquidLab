import React, { Component } from 'react';
import * as actions from '../../../../store/actions/index';
import { connect } from 'react-redux';
import { enforceMaxLength } from '../../../../shared/utility';


import Auxil from '../../../../hoc/Auxil';
import QuantityControl from '../../../../components/QuantityControl/QuantityControl';
import classes from './Quantity.css';

class Quantity extends Component {

    dataEnteredHandler = (event, control) => {
        event.target.value = enforceMaxLength(event.target.value, event.target.maxLength);
        this.props.onDataEntered(control, event.target.value);
    }

    render() {
        let controls =
            <Auxil>
                <p className={classes.Header}>Quantity</p>
                <QuantityControl valid={this.props.mlToMake.valid} change={(event) => this.dataEnteredHandler(event, 'mlToMake')} label="ML To Make:" type="number" suffix="ml" maxLength="4" autofocus />
                <QuantityControl valid={this.props.targetNic.valid} change={(event) => this.dataEnteredHandler(event, 'targetNic')} label="Target Nic:" type="number" suffix="mg" maxLength="3" />
                <QuantityControl valid={this.props.targetPg.valid} change={(event) => this.dataEnteredHandler(event, 'targetPg')} label="Target PG:" type="number" suffix="%" maxLength="3" />
                <QuantityControl valid={this.props.targetVg.valid} change={(event) => this.dataEnteredHandler(event, 'targetVg')} label="Target VG:" type="number" suffix="%" maxLength="3" />
                <QuantityControl change={(event) => this.dataEnteredHandler(event, 'notes')} label="Notes" type="textarea" />
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
        onDataEntered: (control, value) => dispatch(actions.inputDataEntered(control, value))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Quantity);