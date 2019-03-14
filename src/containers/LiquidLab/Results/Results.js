import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, TableHead, TableBody, TableRow, TableCell} from "@material-ui/core";

import classes from './Results.css';
import Auxil from "../../../hoc/Auxil";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {compareResults} from "../../../util/shared";
import * as ToolTip from "../../../constants/Tooltip";
import * as actions from "../../../store/actions";
import Button from "../../../components/ui/Button/Button";
import firebase from 'firebase';

class Results extends Component {
    state = {
        confirmDialog: false,
        imgUrl: null
    };

    /**
     * Register a "leave without saving" alert block on mount
     */
    componentDidMount() {
        if (this.props.image && this.props.image.value !== '') {
            let recipeImg = firebase.storage().ref(this.props.image.value);
            recipeImg.getDownloadURL().then(url => {
                this.setState({ imgUrl: url })
            }).catch(err => { console.error(err) });
        }
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

        let resultBase = [...this.props.base]
        for (let i in resultBase) {
            if (resultBase[i].name === "NIC") {
                let nicAmount = resultBase[i].amount - this.props.results.ingredients.nic.ml;
                resultBase[i].amount = nicAmount > 0 ? nicAmount : 0;
            }
            else if (resultBase[i].name === "PG") {
                let pgAmount = resultBase[i].amount - this.props.results.ingredients.pg.ml;
                resultBase[i].amount = pgAmount > 0 ? pgAmount : 0;
            }
            else if (resultBase[i].name === "VG") {
                let vgAmount = resultBase[i].amount - this.props.results.ingredients.vg.ml;
                resultBase[i].amount = vgAmount > 0 ? vgAmount : 0;
            }
        }

        let resultFlavors = this.props.results.ingredients.flavors;
        for (let r in resultFlavors) {
            for ( let i in inventoryFlavors) {
                if (compareResults(resultFlavors[r], inventoryFlavors[i])) {
                    let flavorAmount = inventoryFlavors[i].amount - resultFlavors[r].ml;
                    inventoryFlavors[i].amount =  flavorAmount > 0 ? flavorAmount : 0;
                }
            }
        }
        //this.props.madeHandler(true);
        this.props.onSaveInventoryData(this.props.token, this.props.dbEntryId, resultBase, inventoryFlavors);
        this.setState({ confirmDialog: false });
    };

    render () {
        const { confirmDialog, imgUrl } = this.state;
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

        let recipeName = results.recipeInfo.name.value ? results.recipeInfo.name.value : "No-Name Recipe";
        recipeName += results.recipeInfo.batch.value ? + " [" + results.recipeInfo.batch.value + "] "
            : "";

        const columns = [{name:'', tooltip: ToolTip.RESULT_INGREDIENT},  {name:'ML', tooltip: ToolTip.RESULT_ML}, {name:'Grams', tooltip: ToolTip.RESULT_GRAM}, {name: '%', tooltip: ToolTip.RESULT_PERCENT}];

        return (
            <Auxil>
                <div style={{overFlowY: 'auto'}}>
                    <div className={classes.HeaderDiv}>
                        {imgUrl ? <img className={classes.RecipeImg} src={imgUrl} alt={results.recipeInfo.name.value} /> : null}
                            <p className={classes.Header}>
                                {recipeName + " "}
                                {results.recipeInfo.batch.value ?
                                    <span style={{fontSize: '0.75em'}}>({results.recipeInfo.batch.value})</span>
                                    : null}
                            </p>
                    </div>
                {results.recipeInfo.notes ?
                    <p className={classes.Notes}><em>{results.recipeInfo.notes.value}</em></p> : null}
                <Table className={classes.Table}>
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell key={column.name}>{<p data-tip={column.tooltip} className={classes.Column}>{column.name}</p>}</TableCell>
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
                        {this.props.token !== null ? <TableRow>
                            <TableCell colSpan={4}>
                                <span data-tip={ToolTip.IMADETHIS}><Button classname="Results" clicked={this.recipeCompletedHandler}>I Made This</Button></span>
                            </TableCell>
                        </TableRow> : null}
                    </TableBody>
                </Table>
                </div>
                <ConfirmDialog open={confirmDialog} close={this.recipeCompletedHandler} confirm={(e) => this.recipeCompletedConfirm(e, displayedResults)}
                               message={"Subtract ingredient usage for " + results.recipeInfo.mlToMake.value + " ml of "
                               + recipeName + " from inventory?"}  />
                <ConfirmDialog open={navWarn} close={ navWarnHandler } confirm={(e) => this.recipeCompletedConfirm(e, displayedResults)}
                               subtitle="Click YES to subtract flavor usage from inventory"
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
        base: state.inventory.base,
        inventory: state.inventory.flavors,
        image: state.formula.inputs.image
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveInventoryData: (token, dbEntryId, base, flavors) => dispatch(actions.saveInventoryData(token, dbEntryId, base, flavors))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);