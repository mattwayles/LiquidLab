import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Table, TableHead, TableBody, TableRow, TableCell} from "@material-ui/core";

import classes from './Results.css';
import Auxil from "../../../hoc/Auxil";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import {compareResults, createNextId} from "../../../util/shared";
import * as ToolTip from "../../../constants/Tooltip";
import * as actions from "../../../store/actions";
import Button from "../../../components/ui/Button/Button";
import firebase from 'firebase';
import AddInventoryDialog from "../../../components/Dialog/AddInventoryDialog";
import {populateNonInventoriedFlavors} from "../../../util/formulaUtil";

class Results extends Component {
    state = {
        confirmDialog: false,
        addInventoryDialog: false,
        imgUrl: null,
        nonInventory: []
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
     * Open the 'add to inventory' dialog
     */
    addToInventoryHandler = () => {
        let nonInventoriedFlavors = populateNonInventoriedFlavors(this.state.nonInventory, this.props.flavors, this.props.inventory);

        if (!this.state.addInventoryDialog && nonInventoriedFlavors.length > 0) {
            this.setState({ confirmDialog: false, addInventoryDialog: true, nonInventory: nonInventoriedFlavors });
        } else {
            this.recipeCompletedConfirm();
            this.setState({ confirmDialog: false, nonInventory: [] });
        }
    };

    /**
     * Handler for closing the Save Confirm dialog
     */
    handleClose = () => {
        this.setState({ addInventoryDialog: false, nonInventory: [] });
    };

    /**
     * Confirm a made recipe and subtract values from inventory
     */
    recipeCompletedConfirm = (addToInventory) => {
        let resultBase = [...this.props.base];
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

        let inventoryFlavors = [...this.props.inventory];
        if (addToInventory) {
            for (let f in this.state.nonInventory) {
                inventoryFlavors.push({
                    amount: 0,
                    id: createNextId([...this.props.inventory]),
                    name: this.state.nonInventory[f].flavor.value,
                    vendor: this.state.nonInventory[f].ven ? this.state.nonInventory[f].ven.value : '',
                    recipes: 0,
                    notes: ''
                })
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
        const inventory = {
            base: [...resultBase],
            flavors: [...inventoryFlavors]
        };

        this.props.madeHandler(true);
        this.props.onSaveInventoryData(this.props.token, this.props.dbEntryId, inventory);
        this.setState({ confirmDialog: false, addInventoryDialog: false });
    };

    render () {
        const { confirmDialog, addInventoryDialog, nonInventory, imgUrl } = this.state;
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

        const columns = [{name:'', tooltip: ToolTip.RESULT_INGREDIENT},  {name:'ML', tooltip: ToolTip.RESULT_ML}, {name:'Grams', tooltip: ToolTip.RESULT_GRAM}, {name: '%', tooltip: ToolTip.RESULT_PERCENT}];

        return (
            <Auxil>
                <div style={{overFlowY: 'auto'}}>
                    <div className={classes.HeaderDiv}>
                        {imgUrl ? <img className={classes.RecipeImg} src={imgUrl} alt={results.recipeInfo.name.value} /> : null}
                            <p className={classes.Header}>
                                {recipeName + " "}
                                {results.recipeInfo.batch.value ?
                                    <span style={{fontSize: '0.75em'}}>[{results.recipeInfo.batch.value}]</span>
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

                <ConfirmDialog open={confirmDialog} close={this.recipeCompletedHandler} confirm={this.addToInventoryHandler}
                               message={"Subtract ingredient usage for " + results.recipeInfo.mlToMake.value + " ml of "
                               + recipeName + " from inventory?"}  />
                <ConfirmDialog open={navWarn} close={ navWarnHandler } confirm={this.addToInventoryHandler }
                               subtitle="Click YES to subtract flavor usage from inventory"
                               message={"You calculated results for " + results.recipeInfo.mlToMake.value + " ml of "
                               + recipeName + ". Did you make it?"}  />
                <AddInventoryDialog open={addInventoryDialog} close={this.handleClose} save={this.recipeCompletedConfirm}
                                    addAndSave={ this.recipeCompletedConfirm } inventoryList={nonInventory}/>
            </Auxil>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        results: state.results,
        flavors: state.formula.flavors,
        base: state.inventory.base,
        inventory: state.inventory.flavors,
        image: state.formula.inputs.image
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveInventoryData: (token, dbEntryId, inventory) => dispatch(actions.saveInventoryData(token, dbEntryId, inventory))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);