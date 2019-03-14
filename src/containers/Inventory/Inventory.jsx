import React from 'react';
import {Dialog, DialogContent, DialogTitle, DialogActions} from "@material-ui/core";
import {connect} from "react-redux";
import classes from './Inventory.css';
import Auxil from "../../hoc/Auxil";
import * as actions from "../../store/actions";
import {detectRecipeInclusion} from "../../util/inventoryUtil";
import Button from "../../components/ui/Button/Button";
import InventoryFlavors from "./InventoryFlavors/InventoryFlavors";
import InventoryBase from "./InventoryBase/InventoryBase";

/**
 * Manage a user's inventory list
 */
class Inventory extends React.Component {
    state = {
        base: [],
        flavors: [],
    };

    /**
     * When opening the Inventory, sort all items available in Redux
     */
    componentWillMount() {
        let flavors  = this.props.flavors.sort((a, b) => {
            return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0)
        });
        let base = this.props.base;
        this.setState({ base: base, flavors: flavors });
    }

    /**
     * When closing the inventory, return to the main screen
     */
    handleClose = () => {
        this.props.history.push("/")
    };

    /**
     * Set base state
     * @param base  The new base state
     */
    handleSetBase = (base) => {
        this.setState({ base: base });
    };

    /**
     * Set flavor state
     * @param flavors The new flavor state
     */
    handleSetFlavors = (flavors) => {
        this.setState({ flavors: flavors });
    };

    /**
     * Handler for automatically detecting the # of Recipes for new inventory items, and saving to database
     */
    handleSaveInventory = () => {
        let newFlavors = [...this.state.flavors];
        if (newFlavors && this.props.flavors && newFlavors.length > this.props.flavors.length) {
            newFlavors = detectRecipeInclusion(newFlavors, this.props.flavors, this.props.recipes);
            this.setState({ flavors: newFlavors });
        }

        this.props.onSaveInventoryData(this.props.token, this.props.dbEntryId, this.state.base, this.state.flavors);
        this.props.history.push("/");
    };


    render() {
        const { flavors, base, } = this.state;

        return(
            <Auxil>
                <Dialog maxWidth={false} open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{marginTop: '1vw'}}><span className={classes.Header}>Inventory</span></DialogTitle>
                    <DialogContent>
                        <InventoryBase
                            classes={classes}
                            data={base}
                            handleSetBase={this.handleSetBase}
                            handleKeyDown={this.handleKeyDown}
                            handleBlur={this.handleBlur}
                            handleFocus={this.handleFocus}
                            handleEditBegin={this.handleEditBegin}
                            handleTableSort={this.handleTableSort}
                            handleSaveInventory={this.handleSaveInventory}
                        />
                        <br />
                        <br />
                        <InventoryFlavors
                            classes={classes}
                            data={flavors}
                            handleSetFlavors={this.handleSetFlavors}
                            handleKeyDown={this.handleKeyDown}
                            handleBlur={this.handleBlur}
                            handleFocus={this.handleFocus}
                            handleEditBegin={this.handleEditBegin}
                            handleAdd={this.handleAdd}
                            handleDelete={this.handleDelete}
                            handleTableSort={this.handleTableSort}
                            handleSaveInventory={this.handleSaveInventory}
                        />
                </DialogContent>
                <DialogActions>
                    <Button classname="Dialog" clicked={this.handleClose}>
                        Close
                    </Button>
                    <Button classname="Dialog" clicked={this.handleSaveInventory}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            </Auxil>
        );
    }
}

const mapStateToProps = state => {
    return {
        base: state.inventory.base,
        flavors: state.inventory.flavors,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        recipes: state.database.userRecipes
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveInventoryData: (token, dbEntryId, base, flavors) => dispatch(actions.saveInventoryData(token, dbEntryId, base, flavors))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Inventory);