import React, { Component } from 'react';
import * as actions from '../../../../store/actions/index';
import { connect } from 'react-redux';


import Auxil from '../../../../hoc/Auxil';
import QuantityControl from '../../../../components/QuantityControl/QuantityControl';
import classes from './Quantity.css';

class Quantity extends Component {
    enforceMaxLength = (value, maxLength) => {
        return value.slice(0,maxLength)
    };

    dataEnteredHandler = (event, control) => {
        event.target.value = this.enforceMaxLength(event.target.value, event.target.maxLength);

        this.props.onDataEntered(control, event.target.value);
    }

    render() {
        let controls =
            <Auxil>
                <p className={classes.Header}>Quantity</p>
                <QuantityControl change={(event) => this.dataEnteredHandler(event, 'mlToMake')} label="ML To Make:" type="number" suffix="ml" maxLength="4" autofocus />
                <QuantityControl change={(event) => this.dataEnteredHandler(event, 'targetNic')} label="Target Kel:" type="number" suffix="mg" maxLength="3"/>
                <QuantityControl change={(event) => this.dataEnteredHandler(event, 'targetPg')} label="Target PG:" type="number" suffix="%" maxLength="3"/>
                <QuantityControl change={(event) => this.dataEnteredHandler(event, 'targetVg')} label="Target VG:" type="number" suffix="%" maxLength="3"/>
                <QuantityControl change={(event) => this.dataEnteredHandler(event, 'notes')} label="Notes" type="textarea" />
            </Auxil>
        return (
            <div className={classes.Quantity}>
                {controls}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        mlToMake: state.formula.mlToMake,
        targetNic: state.formula.targetNic,
        targetPg: state.formula.targetPg,
        targetVg: state.formula.targetVg,
        notes: state.formula.notes
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onDataEntered: (control, value) => dispatch(actions.quantityDataEntered(control, value))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Quantity);