import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, TableHead, TableBody, TableRow, TableCell} from "@material-ui/core";

import classes from './Results.css';
import ResultsButton from "../../../components/ui/Button/ResultsButton";
import Auxil from "../../../hoc/Auxil";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {compareResults} from "../../../util/shared";
import * as actions from "../../../store/actions";

class Results extends Component {
    state = {
        confirmDialog: false,
    };

    /**
     * Register a "leave without saving" alert block on mount
     */
    componentDidMount() {
        window.addEventListener('beforeunload',(e) => {
            if (!this.props.made) {
                let message = 'Warning!\n\nNavigating away from this page will delete your text if you haven\'t already saved it.';
                e.returnValue = message;
                return message;
            }
        });
    }

    /**
     * Unregister the alert block on unmount
     */
    componentWillUnmount() {
        window.removeEventListener('beforeunload', null);
    }

    /**
     * Open the 'confirm recipe made' dialog
     */
    recipeCompletedHandler = () => {
        this.setState({ confirmDialog: !this.state.confirmDialog });
    };

    /**
     * Confirm a made recipe and subtract values from inventory
     */
    recipeCompletedConfirm = () => {
        let inventoryFlavors = [...this.props.inventory];
        let resultFlavors = this.props.results.ingredients.flavors;

        for (let r in resultFlavors) {
            for ( let i in inventoryFlavors) {
                if (compareResults(resultFlavors[r], inventoryFlavors[i])) {
                    inventoryFlavors[i].amount = inventoryFlavors[i].amount - resultFlavors[r].ml;
                    if (inventoryFlavors[i].amount < 0) {
                        inventoryFlavors[i].amount = 0;
                    }
                }
            }
        }
        this.props.madeHandler(true);
        this.props.onSaveFlavorData(this.props.token, this.props.dbEntryId, inventoryFlavors);
        this.setState({ confirmDialog: false });
    };

    render () {
        const { confirmDialog } = this.state;
        const { results, navWarnHandler, navWarn } = this.props;

        let displayedResults = [];

        //Caclulate and populate Results
        Object.keys(results.ingredients).map((item, index) => {
            if (item === 'flavors') {
                return results.ingredients.flavors.map((flavor, flavorIndex) => {
                    if (flavor.percent > 0) {
                        let flavorName = 'No-Name Flavor';
                        if (flavor.flavor) {
                            flavorName = flavor.flavor;
                        }
                        return displayedResults.push({
                            key: index + flavorIndex,
                            ven: flavor.ven,
                            flavor: flavorName,
                            ml: flavor.ml,
                            grams: flavor.grams,
                            percent: flavor.percent + '%'
                        })

                    } else {
                        return null;
                    }
                });
            }
            else {
                if (results.ingredients[item].percent > 0) {
                    return displayedResults.push({
                        key: index,
                        flavor: item.toUpperCase(),
                        ml: results.ingredients[item].ml,
                        grams: results.ingredients[item].grams,
                        percent: results.ingredients[item].percent + '%'
                    })
                } else { return null }
            }
        });


        const recipeName = results.recipeInfo.batch.value ?  results.recipeInfo.name.value + " [" + results.recipeInfo.batch.value + "] "
            : results.recipeInfo.name.value;

        const columns = ['', 'ML', 'Grams', '%'];
        return (
            <Auxil>
                <div style={{overFlowY: 'auto'}}>
                <p className={classes.Header}>
                    {results.recipeInfo.name.value + " "}
                    {results.recipeInfo.batch.value ?
                        <span style={{fontSize: '0.75em'}}>({results.recipeInfo.batch.value})</span>
                        : null}
                </p>
                {results.recipeInfo.notes ?
                    <p className={classes.Notes}><em>{results.recipeInfo.notes.value}</em></p> : null}
                <Table className={classes.Table}>
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell key={column}>{<p className={classes.Column}>{column}</p>}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedResults.map(res => {
                            return <TableRow key={res.key}>
                                <TableCell>{res.ven ? res.ven + "  " + res.flavor : res.flavor}</TableCell>
                                <TableCell><p className={classes.ResultCell}>{res.ml}</p></TableCell>
                                <TableCell><p className={classes.ResultCell}>{<span className={classes.Grams}>{res.grams}</span>}</p></TableCell>
                                <TableCell><p className={classes.ResultCell}>{res.percent}</p></TableCell>
                            </TableRow>
                        })}
                        <TableRow>
                            <TableCell colSpan={4}>
                                <ResultsButton clicked={this.recipeCompletedHandler}>I Made This</ResultsButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
                <ConfirmDialog open={confirmDialog} close={this.recipeCompletedHandler} confirm={(e) => this.recipeCompletedConfirm(e, displayedResults)}
                               message={"Subtract ingredient usage for " + results.recipeInfo.mlToMake.value + " ml of "
                               + recipeName + " from inventory?"}  />
                <ConfirmDialog open={navWarn} close={ navWarnHandler } confirm={(e) => this.recipeCompletedConfirm(e, displayedResults)}
                               message={"You calculated results for " + results.recipeInfo.mlToMake.value + " ml of "
                               + recipeName + ". Did you make it?"}  />
            </Auxil>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        results: state.results,
        inventory: state.inventory.flavors
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveFlavorData: (token, dbEntryId, flavors) => dispatch(actions.saveFlavorData(token, dbEntryId, flavors))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);