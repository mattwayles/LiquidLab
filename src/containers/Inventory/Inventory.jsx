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
import { createNextId, getNextId } from "../../util/shared";
import {sortTable, userInput} from "../../util/inventoryUtil";

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

    handleKeyDown = (event, row, control) => {
        if (event.keyCode === 9 && this.state.edit) {
            event.preventDefault();
            if (this.state.edit.cell === 'vendor') {
                this.setState({edit: {...this.state.edit, cell: 'name'}})
            }
            else if (this.state.edit.cell === 'name') {
                this.setState({edit: {...this.state.edit, cell: 'amount'}})
            }
            else if (this.state.edit.cell === 'amount') {
                if (this.state.edit.row + 1 > this.state.flavors.length) {
                    this.handleAdd();
                    this.setState({ edit: {row: createNextId(this.state.flavors), cell: "vendor"}})
                }
                else {
                    this.setState({edit: {row: getNextId(this.state.flavors, this.state.edit.row), cell: "vendor"}})
                }
            }
        }
        else {
            const data = userInput(event, row, control, this.state.flavors);
            this.setState({ flavors: data })
        }
    };

    handlePaste = (e, row, control) => {
        let data = [...this.state.flavors];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                const clipboardText = e.clipboardData.getData("Text");
                data[flavor] = {...data[flavor], [control]: clipboardText};
            }
        }
        this.setState({ flavors: data })
    };


    handleEditBegin = (e, row, cell) => {
        this.setState({ edit: {row: row.id, cell: cell}})
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
        data.push({id: createNextId(data), vendor: '', name:'New Flavor', amount: 0, recipes: 0});
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
            { name: "amount", label: "Amount Left (ml)" },
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
                                            <TableCell><Input keyDown={(e) => this.handleKeyDown(e, flav, 'vendor')} change={(e) => this.handleKeyDown(e, flav, 'vendor')}
                                                              paste={(e) => this.handlePaste(e, flav, 'vendor')}
                                                              blur={this.handleEditFinish} autoFocus={true} classes={classes.Input}
                                                              value={flav.vendor} focus={(e) => this.handleFocus(e)} maxLength="4"/></TableCell>
                                            : <TableCell onClick={(e) => this.handleEditBegin(e, flav, "vendor")}>{flav.vendor}</TableCell>}
                                    {edit.row === flav.id && edit.cell === "name" ?
                                        <TableCell><Input keyDown={(e) => this.handleKeyDown(e, flav, 'name')} change={(e) => this.handleKeyDown(e, flav, 'vendor')}
                                                          paste={(e) => this.handlePaste(e, flav, 'name')}
                                                          blur={this.handleEditFinish} autoFocus={true} classes={classes.NameInput}
                                                          value={flav.name} focus={(e) => this.handleFocus(e)} /></TableCell>
                                        : <TableCell onClick={(e) => this.handleEditBegin(e, flav, "name")}>{flav.name}</TableCell>}
                                    {edit.row === flav.id && edit.cell === "amount" ?
                                        <TableCell><Input keyDown={(e) => this.handleKeyDown(e, flav, 'amount')} change={(e) => this.handleKeyDown(e, flav, 'vendor')}
                                                          paste={(e) => this.handlePaste(e, flav, 'amount')}
                                                          blur={this.handleEditFinish} autoFocus={true} classes={classes.Input}
                                                          value={flav.amount} type="number" min="0" focus={(e) => this.handleFocus(e)} maxLength="4"/></TableCell>
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
        recipes: state.database.userRecipes
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveFlavorData: (token, dbEntryId, flavors) => dispatch(actions.saveFlavorData(token, dbEntryId, flavors))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Inventory);