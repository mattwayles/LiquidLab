import React from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions,
    Table, TableHead, TableBody, TableRow, TableCell} from "@material-ui/core";
import {connect} from "react-redux";
import classes from './Inventory.css';
import { Add, Delete, Edit, Check } from "@material-ui/icons";
import Button from "../../components/ui/Button/Button";
import Auxil from "../../hoc/Auxil";
import Input from "../../components/ui/Input/Input";

class Inventory extends React.Component {
    state = {
        editRow: null,
        editRowValues: {}
    };

    handleClose = () => {
        this.props.history.push("/")
    };

    handleEditBegin = (e, row) => {
        this.setState({ editRow: row.vendor + row.name,
            editRowValues: {
                vendor: row.vendor,
                name: row.name,
                amount: row.amount,
                recipes: row.recipes
            }})
    };

    handleUserInput = (e, control) => {
        //TODO: OnDataEntered
        this.setState({
            editRowValues: {
                ...this.state.editRowValues,
                [control]: e.target.value
            }
        })
    };

    handleEditSave = () => {
        //TODO: Implement
        //this.props.editInventoryRow(this.state.editRowValues);
        console.log(this.state.editRowValues);
        this.setState({ editRow: null, editRowValues: {}})
    };

    handleDelete = () => {
        //TODO: Implement
        console.log("This deletes a grid row");
    };

    handleAdd = () => {
        //TODO: Implement
        console.log("This adds a grid row");
    };

    handleSaveInventory = () => {
        //TODO: Implement
        console.log("Saving the inventory to DB, but not really");
    };


    render() {
        const { editRow } = this.state;


        const data = [{
            vendor: "TFA",
            name: "Blue Raspberry Cotton Candy",
            amount: 11,
            recipes: 4
        },
            {
                vendor: "FA",
                name: "Cherry",
                amount: 115,
                recipes: 12
            }];

        return(
            <Dialog maxWidth={false} open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle style={{marginTop: '1vw'}}><span className={classes.Header}>Inventory</span></DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginBottom: '2vw'}}>
                        <span className={classes.SubHeader}>Manage your concentrated flavor inventory</span>
                    </DialogContentText>
                    <Table className={classes.Table}>
                        <TableHead>
                            <TableRow>
                                {["Vendor", "Flavor Name", "Amount Left", "# of Recipes", "Actions"].map(head => (
                                    <TableCell key={head}>{head}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map(flav => {
                                return <TableRow key={flav.vendor + flav.name}>
                                        {editRow !== flav.vendor + flav.name ? <Auxil><TableCell>{flav.vendor}</TableCell>
                                    <TableCell>{flav.name}</TableCell>
                                    <TableCell>{flav.amount}</TableCell>
                                    <TableCell>{flav.recipes}</TableCell></Auxil>
                                            :
                                            <Auxil><TableCell><Input classes={classes.Input} change={(e) => this.handleUserInput(e, 'vendor')} value={flav.vendor} /></TableCell>
                                                <TableCell><Input classes={classes.Input} change={(e) => this.handleUserInput(e, 'name')} value={flav.name} /></TableCell>
                                                <TableCell><Input classes={classes.Input} change={(e) => this.handleUserInput(e, 'amount')} value={flav.amount} /></TableCell>
                                                <TableCell><Input classes={classes.Input} change={(e) => this.handleUserInput(e, 'recipes')} value={flav.recipes} /></TableCell></Auxil>}
                                    <TableCell className={classes.FlexRow}>
                                        {editRow === flav.vendor + flav.name ? <Check className={classes.IconBtn} onClick={this.handleEditSave} color={"primary"} />
                                            : <Edit className={classes.IconBtn} onClick={(e) => this.handleEditBegin(e, flav)} color={"primary"} />}&emsp;
                                        <Delete className={classes.IconBtn} onClick={this.handleDelete} color={"secondary"} /></TableCell>
                                </TableRow>
                            })}
                            <TableRow><TableCell span={4}><Add className={classes.IconBtn}
                                                               onClick={this.handleAdd} color={"primary"}/></TableCell></TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button clicked={this.handleClose} color="primary">
                        Close
                    </Button>
                    <Button clicked={this.handleSaveInventory} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {

    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Inventory);