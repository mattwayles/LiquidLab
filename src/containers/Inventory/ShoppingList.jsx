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
import {enforceMaxLength} from "../../util/shared";
import {sortTable} from "../../util/inventoryUtil";

class ShoppingList extends React.Component {
    state = {
        deleteDialog: false,
        deleteRow: {},
        edit: {},
        shoppingList: [],
        sort: {col: "name", asc: true}
    };

    componentWillMount() {
        console.log(this.props.shoppingList);
        let shoppingList  = this.props.shoppingList.sort((a, b) => {
            return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0)
        });
        this.setState({ shoppingList: shoppingList });
    }

    handleClose = () => {
        this.props.history.push("/")
    };

    handleEditBegin = (e, row, cell) => {
        this.setState({ edit: {row: row.id, cell: cell}})
    };

    handleUserInput = (e, row, control) => {
        e.target.value = enforceMaxLength(e.target.value, e.target.maxLength);
        let data = [...this.state.shoppingList];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                data[flavor] = {...data[flavor], [control]: e.target.value};
            }
        }
        this.setState({ shoppingList: data })
    };

    handleEditFinish = () => {
        this.setState({ edit: {} })
    };

    handleDelete = (e, row) => {
        this.setState({ deleteDialog: !this.state.deleteDialog, deleteRow: row });
    };

    handleDeleteConfirm = (e, row) => {
        let data = [...this.state.shoppingList];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                data.splice(flavor, 1);
            }
        }
        this.setState({ shoppingList: data, deleteDialog: false })
    };

    handleAdd = () => {
        let data = [...this.state.shoppingList];
        data.push({id: data.length + 1, vendor: '', name:'New Flavor'});
        this.setState({shoppingList: data});
    };

    handleSaveShoppingList = () => {
        this.props.onSaveShoppingList(this.props.token, this.props.dbEntryId, this.state.shoppingList);
        this.props.history.push("/");
    };

    handleTableSort = (e, column) => {
        const sortedTable = sortTable(this.state.shoppingList, column, this.state.sort);
        this.setState({ shoppingList: sortedTable.flavors, sort: sortedTable.sort });
    };


    render() {
        const { edit, shoppingList, deleteDialog, deleteRow, sort } = this.state;

        const columns = [
            { name: "vendor", label: "Vendor" },
            { name: "name", label: "Flavor Name" }
        ];

        return(
            <Auxil>
                <Dialog maxWidth={false} open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle style={{marginTop: '1vw'}}><span className={classes.Header}>Shopping List</span></DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginBottom: '2vw'}}>
                        <span className={classes.SubHeader}>Manage your low inventory Shopping List</span>
                    </DialogContentText>
                    <Table className={classes.Table}>
                        <TableHead>
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell onClick={(e) => this.handleTableSort(e, column.name, sort)}
                                               key={column.name}>{sort.col === column.name ? sort.asc ?
                                                    <ArrowDropUp fontSize='inherit' /> : <ArrowDropDown fontSize='inherit' /> : null} {column.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shoppingList.map(flav => {
                                return <TableRow key={flav.id}>
                                        {edit.row === flav.id && edit.cell === "vendor" ?
                                            <TableCell><Input blur={this.handleEditFinish} autoFocus={true} classes={classes.Input}
                                                              change={(e) => this.handleUserInput(e, flav, 'vendor')} value={flav.vendor} maxLength="4"/></TableCell>
                                            : <TableCell onClick={(e) => this.handleEditBegin(e, flav, "vendor")}>{flav.vendor}</TableCell>}
                                    {edit.row === flav.id && edit.cell === "name" ?
                                        <TableCell><Input blur={this.handleEditFinish} autoFocus={true} classes={classes.NameInput}
                                                          change={(e) => this.handleUserInput(e, flav, 'name')} value={flav.name} /></TableCell>
                                        : <TableCell onClick={(e) => this.handleEditBegin(e, flav, "name")}>{flav.name}</TableCell>}
                                    <TableCell>
                                        <Delete className={classes.IconBtn} onClick={(e) => this.handleDelete(e, flav)} color={"secondary"} />
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
                    <Button clicked={this.handleSaveShoppingList} color="primary">
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
        shoppingList: state.inventory.shoppingList,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveShoppingList: (token, dbEntryId, list) => dispatch(actions.saveShoppingList(token, dbEntryId, list))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);