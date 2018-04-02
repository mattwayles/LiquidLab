import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import Recipe from './Recipe/Recipe';
import Quantity from './Quantity/Quantity';
import classes from './Formula.css';

class Formula extends Component {
    round = (formula) => {
        return Math.round((formula) * 100) /100;
    };

    mapInputs = () => {
        return {
            mlToMake: this.props.inputs.mlToMake.value,
            inputNic: this.props.inputs.targetNic.value,
            inputPg: this.props.inputs.targetPg.value / 100,
            inputVg: this.props.inputs.targetVg.value / 100,
            nicStrength: this.props.weights.nicStrength,
            nicBasePg: this.props.weights.nicBasePg / 100,
            nicBaseVg: this.props.weights.nicBaseVg / 100,
            flavorWeight: this.props.weights.flavorWeight,
            nicWeight: this.props.weights.nicWeight,
            pgWeight: this.props.weights.pgWeight,
            vgWeight: this.props.weights.vgWeight
        }
    };

    calcBaseResults = (flavorMlTotal) => {
        const input = this.mapInputs();
        const targetNic = this.round(input.mlToMake * input.inputNic);
        const pgTarget = this.round(input.mlToMake * input.inputPg - targetNic * input.nicBasePg);
        const vgTarget = this.round(input.mlToMake * input.inputVg - targetNic * input.nicBaseVg);
        const nicMl = this.round(input.mlToMake / input.nicStrength * input.inputNic);
        const pgMl = this.round(pgTarget - (nicMl - targetNic) * input.nicBasePg - flavorMlTotal);
        const vgMl = this.round(vgTarget - (nicMl - targetNic) * input.nicBaseVg);
        return {
            ...input,
            nicMl: nicMl,
            pgMl: pgMl,
            vgMl: vgMl,
            nicGrams: this.round(nicMl * input.nicWeight),
            pgGrams: this.round(pgMl * input.pgWeight),
            vgGrams: this.round(vgMl * input.vgWeight),
            nicPercent: this.round(nicMl / input.mlToMake * 100),
            pgPercent: this.round(pgMl / input.mlToMake * 100),
            vgPercent: this.round(vgMl / input.mlToMake * 100)
        }
    };

    calculateFlavorResults = (flavor) => {
        const input = this.mapInputs();
        const flavorMl = this.round(input.mlToMake * flavor.percent / 100);
        const flavorGrams = this.round(flavorMl * input.flavorWeight);

        return {
            ven: flavor.ven,
            flavor: flavor.flavor,
            ml: flavorMl,
            grams: flavorGrams,
            percent: flavor.percent
        }
    };

    onCalculate = () => {
        let flavorResults = [];
        let flavorMlTotal = 0;
        
        for (let i = 0; i < this.props.flavors.length; i++) {
            const flavorResult = this.calculateFlavorResults(this.props.flavors[i]);
            flavorMlTotal = flavorMlTotal + flavorResult.ml;
            flavorResults.push(flavorResult);
        }


        this.props.onUpdateIngredients('flavors', flavorResults);

        const baseResults = this.calcBaseResults(flavorMlTotal);

        this.props.onCheckValidityCompare(
            'targetPg', this.props.inputs.targetPg.value, 'targetVg', this.props.inputs.targetVg.value);

        this.props.onUpdateRecipeInfo('name', this.props.inputs.name );
        this.props.onUpdateRecipeInfo('batch', this.props.inputs.batch );
        this.props.onUpdateRecipeInfo('notes', this.props.inputs.notes );
        this.props.onUpdateIngredients('pg', {ml: baseResults.pgMl, grams: baseResults.pgGrams, percent: baseResults.pgPercent});
        this.props.onUpdateIngredients('vg', {ml: baseResults.vgMl, grams: baseResults.vgGrams, percent: baseResults.vgPercent});
        this.props.onUpdateIngredients('nic', {ml: baseResults.nicMl, grams: baseResults.nicGrams, percent: baseResults.nicPercent});
    };


    render () {
        return (
            <div className={classes.Formula}>
                <Quantity  />
                <Recipe clicked={() => {this.onCalculate(); this.props.displayResults()} } />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        inputs: state.formula.inputs,
        flavors: state.formula.flavors,
        weights: state.formula.weights
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCheckValidityCompare: (control1, value1, control2, value2) => dispatch(actions.checkValidityCompare(control1, value1, control2, value2)),
        onUpdateIngredients: (control, value) => dispatch(actions.updateIngredients(control, value)),
        onUpdateRecipeInfo: (control, value) => dispatch(actions.updateRecipeInfo(control, value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Formula);