import React from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions,
    Table, TableHead, TableBody, TableRow, TableCell} from "@material-ui/core";
import {connect} from "react-redux";
import classes from './Inventory.css';
import { Delete, ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Auxil from "../../hoc/Auxil";
import * as ToolTip from '../../constants/Tooltip';
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import * as actions from "../../store/actions";
import {enforceInputConstraints, createNextId} from "../../util/shared";
import {populateShoppingList, sortTable} from "../../util/inventoryUtil";

class ShoppingList extends React.Component {
    state = {
        cutoff: 3,
        deleteDialog: false,
        deleteRow: {},
        edit: {},
        shoppingList: [],
        sort: {col: "name", asc: true}
    };

    /**
     * When opening shopping list, populate with all low-inventory items
     */
    componentWillMount() {
        let shoppingList  = populateShoppingList(this.props.shoppingList, this.props.flavors, this.props.cutoff);
        this.setState({ cutoff: this.props.cutoff, shoppingList: shoppingList });
    }

    /**
     * When closing the shopping list, return to the main page
     */
    handleClose = () => {
        this.props.history.push("/")
    };

    /**
     * Handler for when a key is pressed in an Shopping List Input object
     * @param event The keyDown event
     * @param row   The row of the control receiving the event
     * @param control   The control receiving the event
     */
    handleKeyDown = (event, row, control) => {
        if (event.keyCode === 9 && this.state.edit) {
            event.preventDefault();
            if (this.state.edit.cell === 'vendor') {
                this.setState({edit: {...this.state.edit, cell: 'name'}})
            }
            else if (this.state.edit.cell === 'name') {
                let index = this.state.shoppingList.indexOf(row);
                if (index + 1 >= this.state.shoppingList.length) {
                    this.handleAdd();
                    this.setState({ edit: {row: createNextId(this.state.shoppingList), cell: "vendor"}})
                }
                else {
                    this.setState({edit: {row: index + 1, cell: "vendor"}})
                }
            }
        }
        else if (event.keyCode === 13) {
            this.handleSaveShoppingList();
        }
        else {
            let value = enforceInputConstraints(event.target.value, event.target.maxLength);

            let copiedShoppingList = this.state.shoppingList;
            for (let i in copiedShoppingList) {
                if (copiedShoppingList[i].id === row.id) {
                    copiedShoppingList[i] = {...copiedShoppingList[i], [control]: value}
                }
            }
            this.setState({ shoppingList: copiedShoppingList });
        }
    };

    /**
     * Handler for pasting data into an Shopping List Input object
     * @param e The paste event
     * @param row   The row of the control receiving the event
     * @param control   The control receiving the event
     */
    handlePaste = (e, row, control) => {
        let data = [...this.state.shoppingList];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                const clipboardText = e.clipboardData.getData("Text");
                data[flavor] = {...data[flavor], [control]: clipboardText};
            }
        }
        this.setState({ shoppingList: data })
    };

    /**
     * Handler for when a component comes into focus
     * @param event The focus event
     */
    handleFocus = (event) => {
        event.target.select();
    };

    /**
     * When a shopping list component is clicked on, open an editable Input object
     * @param e The click event
     * @param row   The row of the component receiving the click event
     * @param cell  The component receiving the click event
     */
    handleEditBegin = (e, row, cell) => {
        this.setState({ edit: {row: row.id, cell: cell}})
    };

    /**
     * Handler for user entry in the 'Cutoff' Input component
     * @param e The user input event
     */
    handleCutoffInput = (e) => {
        e.target.value = enforceInputConstraints(e.target.value, e.target.maxLength);
        let shoppingList  = populateShoppingList(this.props.shoppingList, this.props.flavors, e.target.value);
        this.setState({ cutoff: e.target.value, shoppingList: shoppingList});
    };

    /**
     * Set the new inventory value to state once an Input object is blurred
     */
    handleBlur = () => {
        this.setState({ edit: {} })
    };

    /**
     * Open the "Are you sure you want to delete" window
     * @param e The delete event
     * @param row   The row of the object being deleted
     */
    handleDelete = (e, row) => {
        this.setState({ deleteDialog: !this.state.deleteDialog, deleteRow: row });
    };

    /**
     * Confirm deletion of a shopping list item
     * @param e The delete event
     * @param row   The row being deleted
     */
    handleDeleteConfirm = (e, row) => {
        let data = [...this.state.shoppingList];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                data.splice(flavor, 1);
            }
        }
        this.setState({ shoppingList: data, deleteDialog: false })
    };

    /**
     * Handler for adding a new Shopping List item
     */
    handleAdd = () => {
        let data = [...this.state.shoppingList];
        data.push({id: createNextId(data), vendor: '', name:'New Flavor'});
        this.setState({shoppingList: data});
    };

    /**
     * Handler for saving the shopping list to the database
     */
    handleSaveShoppingList = () => {
        let shoppingList = [];
        for (let i in this.state.shoppingList) {
            if (!this.state.shoppingList[i].auto) {
                shoppingList.push(this.state.shoppingList[i]);
            }
        }
        this.props.onSaveShoppingList(this.props.token, this.props.dbEntryId, this.state.cutoff, shoppingList);
        this.props.history.push("/");
    };

    /**
     * Sort the list by column click
     * @param e The column click event
     * @param column    The column to be sorted
     */
    handleTableSort = (e, column) => {
        const sortedTable = sortTable(this.state.shoppingList, column, this.state.sort);
        this.setState({ shoppingList: sortedTable.flavors, sort: sortedTable.sort });
    };


    render() {
        const { edit, shoppingList, deleteDialog, deleteRow, sort } = this.state;

        const columns = [
            { name: "vendor", label: "Vendor", tooltip: ToolTip.VENDOR},
            { name: "name", label: "Flavor Name", tooltip:  ToolTip.FLAVOR},
            { name: 'remove', label: "Remove", tooltip:  ToolTip.INVENTORY_DELETE}
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
                            <TableRow style={{height: '10px'}}>
                                {columns.map(column => (
                                    <TableCell className={classes.TableCell}  onClick={column.name !== 'remove' ? (e) => this.handleTableSort(e, column.name, sort) : null}
                                               key={column.name}><div data-tip={column.tooltip}>{sort.col === column.name ? sort.asc ?
                                                    <ArrowDropUp fontSize='inherit' /> : <ArrowDropDown fontSize='inherit' /> : null} {column.label}</div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shoppingList.map(flav => {
                                return <TableRow style={{height: '10px'}} key={flav.id}>
                                        {!flav.auto && edit.row === this.state.shoppingList.indexOf(flav) && edit.cell === "vendor" ?
                                            <TableCell><Input keyDown={(e) => this.handleKeyDown(e, flav, 'vendor')} change={(e) => this.handleKeyDown(e, flav, 'vendor')}
                                                              blur={this.handleBlur} paste={(e) => this.handlePaste(e, flav, 'vendor')}
                                                              autoFocus={true} classes={classes.Input} focus={(e) => this.handleFocus(e)} value={flav.vendor} maxLength="4"/></TableCell>
                                            : <TableCell className={classes.TableCell} onClick={(e) => this.handleEditBegin(e, flav, "vendor")}>{flav.vendor}</TableCell>}
                                    {!flav.auto && edit.row === this.state.shoppingList.indexOf(flav) && edit.cell === "name" ?
                                        <TableCell><Input keyDown={(e) => this.handleKeyDown(e, flav, 'name')} change={(e) => this.handleKeyDown(e, flav, 'name')}
                                                          blur={this.handleBlur} paste={(e) => this.handlePaste(e, flav, 'vendor')}
                                                          autoFocus={true} classes={classes.NameInput} focus={(e) => this.handleFocus(e)} value={flav.name} /></TableCell>
                                        : <TableCell className={classes.TableCell} onClick={(e) => this.handleEditBegin(e, flav, "name")}>{flav.name}</TableCell>}
                                    {!flav.auto ?
                                        <TableCell>
                                        <div data-tip={ToolTip.INVENTORY_DELETE}>
                                            <Delete fontSize="inherit" className={classes.IconBtn} onClick={(e) => this.handleDelete(e, flav)} color={"secondary"} />
                                        </div>

                                        </TableCell> : <TableCell><div className={classes.EmptyDiv} data-tip={ToolTip.INVENTORY_CANT_DELETE}>
                                        </div></TableCell> }
                                </TableRow>
                            })}
                            <TableRow><TableCell span={4}><span data-tip={ToolTip.INVENTORY_PLUS_BUTTON}>
                                    <button
                                        key="plusBtn"
                                        className={classes.PlusButton}
                                        onClick={this.handleAdd}
                                    >+</button>
                                </span></TableCell></TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
                    <div className={classes.AmtLeft}>
                        <p>Amount Left Cutoff:</p>
                        <Input  tooltip={ToolTip.AMOUNT_LEFT_CUTOFF}
                                focus={(e) => this.handleFocus(e)} blur={this.handleBlur} autoFocus={true} type="number" min="0" classes={classes.AmtLeftInput}
                               change={(e) => this.handleCutoffInput(e)} value={this.state.cutoff} maxLength="5"/>
                        <p>ML</p>
                    </div>
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
        cutoff: state.inventory.cutoff,
        flavors: state.inventory.flavors,
        shoppingList: state.inventory.shoppingList,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSaveShoppingList: (token, dbEntryId, cutoff, list) => dispatch(actions.saveShoppingList(token, dbEntryId, cutoff, list))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);