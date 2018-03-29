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

    calcInputs = () => {
        return {
            flavorMlTotal: this.props.results.flavorMlTotal,
            mlToMake: this.props.quantity.mlToMake,
            inputNic: this.props.quantity.targetNic,
            inputPg: this.props.quantity.targetPg / 100,
            inputVg: this.props.quantity.targetVg / 100,
            nicStrength: this.props.weights.nicStrength,
            nicBasePg: this.props.weights.nicBasePg / 100,
            nicBaseVg: this.props.weights.nicBaseVg / 100,
            flavorWeight: this.props.weights.flavorWeight,
            nicWeight: this.props.weights.nicWeight,
            pgWeight: this.props.weights.pgWeight,
            vgWeight: this.props.weights.vgWeight
        }
    };

    calcBaseResults = () => {
        const input = this.calcInputs();
        const targetNic = this.round(input.mlToMake * input.inputNic);
        const pgTarget = this.round(input.mlToMake * input.inputPg - targetNic * input.nicBasePg);
        const vgTarget = this.round(input.mlToMake * input.inputVg - targetNic * input.nicBaseVg);
        const nicMl = this.round(input.mlToMake / input.nicStrength * input.inputNic);
        const pgMl = this.round(pgTarget - (nicMl - targetNic) * input.nicBasePg - input.flavorMlTotal);
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
        const input = this.calcInputs();
        const flavorMl = this.round(input.mlToMake * flavor.percent / 100);
        const flavorGrams = this.round(flavorMl * input.flavorWeight);

        //TODO: THIS IS NOT WORKING. THE VALUE IS NOT STICKING, ONLY THE NEWEST VALUE IS BEING SET. FIX!
        const newFlavorMlTotal = input.flavorMlTotal + flavorMl;
        this.props.onCalculateResults('flavorMlTotal', newFlavorMlTotal);


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
        for (let i = 0; i < this.props.flavors.length; i++) {
            flavorResults.push(this.calculateFlavorResults(this.props.flavors[i]));
        }
        this.props.onCalculateResults('flavors', flavorResults);

        //TODO: NEEDS TO WORK BEFORE CALLING BASERESULTS
        console.log(this.props.quantity.flavorMlTotal);

        const baseResults = this.calcBaseResults();
        this.props.onCalculateResults('pg', {ml: baseResults.pgMl, grams: baseResults.pgGrams, percent: baseResults.pgPercent});
        this.props.onCalculateResults('vg', {ml: baseResults.vgMl, grams: baseResults.vgGrams, percent: baseResults.vgPercent});
        this.props.onCalculateResults('nic', {ml: baseResults.nicMl, grams: baseResults.nicGrams, percent: baseResults.nicPercent});
    };


    render () {
        console.log(
            "Nic ML: ", this.props.results.nic.ml +
            " Nic Grams: ", this.props.results.nic.grams +
                " Nic Percent: ", this.props.results.nic.percent +
            " PG ML: ", this.props.results.pg.ml +
            " PG Grams: ", this.props.results.pg.grams +
            " PG Percent: ", this.props.results.pg.percent +
            " VG ML: ", this.props.results.vg.ml +
            " VG Grams: ", this.props.results.vg.grams +
            " VG Percent: ", this.props.results.vg.percent
        );

        for (let i = 0; i < this.props.results.flavors.length; i++) {
            console.log(this.props.results.flavors[i]);
        }


        return (
            <div className={classes.Formula}>
                <Quantity  />
                <Recipe clicked={this.onCalculate} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        quantity: state.formula.quantity,
        flavors: state.formula.flavors,
        weights: state.formula.weights,
        results: state.results
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onCalculateResults: (control, value) => dispatch(actions.calculateResults(control, value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Formula);