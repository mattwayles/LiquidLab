import React from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions,
    Table, TableHead, TableBody, TableRow, TableCell} from "@material-ui/core";
import {connect} from "react-redux";
import classes from './Inventory.css';
import { Add, Delete, ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Auxil from "../../hoc/Auxil";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import * as actions from "../../store/actions";
import {enforceInputConstraints} from "../../util/shared";
import {sortTable} from "../../util/inventoryUtil";

class Inventory extends React.Component {
    state = {
        deleteDialog: false,
        deleteRow: {},
        edit: {},
        flavors: [],
        sort: {col: "name", asc: true}
    };

    componentWillMount() {
        let flavors  = this.props.flavors.sort((a, b) => {
            return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0)
        });
        this.setState({ flavors: flavors });
    }

    handleClose = () => {
        this.props.history.push("/")
    };

    handleFocus = (event) => {
        event.target.select();
    };

    handleEditBegin = (e, row, cell) => {
        this.setState({ edit: {row: row.id, cell: cell}})
    };

    handleUserInput = (e, row, control) => {
        e.target.value = enforceInputConstraints(e.target.value, e.target.maxLength);
        let data = [...this.state.flavors];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                data[flavor] = {...data[flavor], [control]: e.target.value};
            }
        }
        this.setState({ flavors: data })
    };

    handleEditFinish = () => {
        this.setState({ edit: {} })
    };

    handleDelete = (e, row) => {
        this.setState({ deleteDialog: !this.state.deleteDialog, deleteRow: row });
    };

    handleDeleteConfirm = (e, row) => {
        let data = [...this.state.flavors];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                data.splice(flavor, 1);
            }
        }
        this.setState({ flavors: data, deleteDialog: false })
    };

    handleAdd = () => {
        let data = [...this.state.flavors];
        data.push({id: data.length + 1, vendor: '', name:'New Flavor', amount: 0, recipes: 0});
        this.setState({flavors: data});
    };

    handleSaveInventory = () => {
        this.props.onSaveFlavorData(this.props.token, this.props.dbEntryId, this.state.flavors);
        this.props.history.push("/");
    };

    handleTableSort = (e, column) => {
        const sortedTable = sortTable(this.state.flavors, column, this.state.sort);
        this.setState({ flavors: sortedTable.flavors, sort: sortedTable.sort });
    };


    render() {
        const { edit, flavors, deleteDialog, deleteRow, sort } = this.state;

        const columns = [
            { name: "vendor", label: "Vendor" },
            { name: "name", label: "Flavor Name" },
            { name: "amount", label: "Amount Left" },
            { name: "recipes", label: "# of Recipes" },
            { name: "remove", label: "Remove" }
        ];

        return(
            <Auxil>
                <Dialog maxWidth={false} open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle style={{marginTop: '1vw'}}><span className={classes.Header}>Inventory</span></DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginBottom: '2vw'}}>
                        <span className={classes.SubHeader}>Manage your concentrated flavor inventory</span>
                    </DialogContentText>
                    <Table className={classes.Table}>
                        <TableHead>
                            <TableRow style={{height: '10px'}}>
                                {columns.map(column => (
                                    <TableCell onClick={column.name !== 'remove' ? (e) => this.handleTableSort(e, column.name, sort) : null}
                                               key={column.name}>{sort.col === column.name ? sort.asc ?
                                                    <ArrowDropUp fontSize='inherit' /> : <ArrowDropDown fontSize='inherit' /> : null} {column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flavors.map(flav => {
                                return <TableRow style={{height: '10px'}} key={flav.id}>
                                        {edit.row === flav.id && edit.cell === "vendor" ?
                                            <TableCell><Input blur={this.handleEditFinish} autoFocus={true} classes={classes.Input}
                                                              change={(e) => this.handleUserInput(e, flav, 'vendor')} value={flav.vendor}
                                                              focus={(e) => this.handleFocus(e)} maxLength="4"/></TableCell>
                                            : <TableCell onClick={(e) => this.handleEditBegin(e, flav, "vendor")}>{flav.vendor}</TableCell>}
                                    {edit.row === flav.id && edit.cell === "name" ?
                                        <TableCell><Input blur={this.handleEditFinish} autoFocus={true} classes={classes.NameInput}
                                                          change={(e) => this.handleUserInput(e, flav, 'name')}
                                                          value={flav.name} focus={(e) => this.handleFocus(e)} /></TableCell>
                                        : <TableCell onClick={(e) => this.handleEditBegin(e, flav, "name")}>{flav.name}</TableCell>}
                                    {edit.row === flav.id && edit.cell === "amount" ?
                                        <TableCell><Input blur={this.handleEditFinish} autoFocus={true} classes={classes.Input}
                                                          change={(e) => this.handleUserInput(e, flav, 'amount')} value={flav.amount}
                                                          type="number" min="0" focus={(e) => this.handleFocus(e)} maxLength="4"/></TableCell>
                                        : <TableCell  onClick={(e) => this.handleEditBegin(e, flav, "amount")} >{flav.amount}</TableCell>}
                                        <TableCell >{flav.recipes}</TableCell>
                                    <TableCell>
                                        <Delete fontSize="inherit" className={classes.IconBtn} onClick={(e) => this.handleDelete(e, flav)} color={"secondary"} />
                                    </TableCell>
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
                <ConfirmDialog open={deleteDialog} close={this.handleDelete} confirm={(e) => this.handleDeleteConfirm(e, deleteRow)}
                               message={deleteRow ? "Are you sure you want to delete " + deleteRow.vendor + " " + deleteRow.name + "?" : ''} />
            </Auxil>
        );
    }
}

const mapStateToProps = state => {
    return {
        flavors: state.inventory.flavors,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveFlavorData: (token, dbEntryId, flavors) => dispatch(actions.saveFlavorData(token, dbEntryId, flavors))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Inventory);