import React from 'react';
import Auxil from "../../../hoc/Auxil";
import DialogContentText from "@material-ui/core/es/DialogContentText/DialogContentText";
import Table from "@material-ui/core/es/Table/Table";
import TableHead from "@material-ui/core/es/TableHead/TableHead";
import TableRow from "@material-ui/core/es/TableRow/TableRow";
import TableCell from "@material-ui/core/es/TableCell/TableCell";
import ArrowDropUp from "@material-ui/icons/es/ArrowDropUp";
import ArrowDropDown from "@material-ui/icons/es/ArrowDropDown";
import * as classes from '../Inventory.css';
import * as ToolTip from "../../../constants/Tooltip";
import TableBody from "@material-ui/core/es/TableBody/TableBody";
import Input from "../../../components/ui/Input/Input";
import {createNextId, enforceInputConstraints, round} from "../../../util/shared";
import Delete from "@material-ui/icons/es/Delete";
import {sortTable} from "../../../util/inventoryUtil";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";

class InventoryFlavors extends React.Component {
    state = {
        data: [],
        edit: {},
        sort: {col: "name", asc: true},
        deleteDialog: false,
        deleteRow: {},
    };

    /**
     * When opening the Inventory, sort all items available in Redux
     */
    componentWillMount() {
        this.setState({ data: this.props.data });
    }

    /**
     * Handler for when a component comes into focus
     * @param event The focus event
     */
    handleFocus = (event) => {
        event.target.select();
    };

    /**
     * Handler for when a key is pressed in an Inventory Input object
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
                this.setState({edit: {...this.state.edit, cell: 'amount'}})
            }
            else if (this.state.edit.cell === 'amount') {
                this.setState({edit: {...this.state.edit, cell: 'notes'}})
            }
            else if (this.state.edit.cell === 'notes') {
                let index = this.state.data.indexOf(row);
                if (index + 1 >= this.state.data.length) {
                    this.handleAdd();
                    this.setState({ edit: {row: createNextId(this.state.data), cell: "vendor"}})
                }
                else {
                    this.setState({edit: {row: index + 1, cell: "vendor"}})
                }
            }
        }
        else if (event.keyCode === 13) {
            this.props.handleSaveInventory();
        }
        else {
            let value = enforceInputConstraints(event.target.value, event.target.maxLength);

            let copiedFlavors = this.state.data;
            for (let i in copiedFlavors) {
                if (copiedFlavors[i].id === row.id) {
                    copiedFlavors[i] = {...copiedFlavors[i], [control]: value}
                }
            }
            this.props.handleSetFlavors(copiedFlavors);
        }
    };

    /**
     * When an inventory component is clicked on, open an Editable Input object
     * @param e The click event
     * @param row   The row of the component receiving the click event
     * @param cell  The component receiving the click event
     */
    handleEditBegin = (e, row, cell) => {
        this.setState({ edit: {row: this.state.data.indexOf(row), cell: cell}})
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
     * Confirm deletion of an inventory item
     * @param e The delete event
     * @param row   The row being deleted
     */
    handleDeleteConfirm = (e, row) => {
        let data = [...this.state.data];
        for (let flavor in data) {
            if (data[flavor].id === row.id) {
                data.splice(flavor, 1);
            }
        }
        this.props.handleSetFlavors(data);
        this.setState({ data: data, deleteDialog: false });
    };

    /**
     * Handler for adding a new Inventory item
     */
    handleAdd = () => {
        let data = [...this.state.data];
        data.push({id: createNextId(data), vendor: '', name:'New Flavor', amount: 0, recipes: 0, notes: ''});
        this.props.handleSetFlavors(data);
        this.setState({data: data});
    };

    /**
     * Sort the list by column click
     * @param e The column click event
     * @param column    The column to be sorted
     */
    handleTableSort = (e, column) => {
        const sortedTable = sortTable(this.state.data, column, this.state.sort);
        this.setState({ data: sortedTable.data, sort: sortedTable.sort });
    };
    
    render() {

        const { data, edit, sort, deleteDialog, deleteRow} = this.state;

        const columns = [
            {name: "vendor", label: "Vendor", tooltip: ToolTip.VENDOR},
            {name: "name", label: "Flavor Name", tooltip: ToolTip.FLAVOR},
            {name: "amount", label: "Amount Left (ml)", tooltip: ToolTip.INVENTORY_AMOUNT_LEFT},
            {name: "recipes", label: "# of Recipes", tooltip: ToolTip.INVENTORY_RECIPE_COUNT},
            {name: "notes", label: "Notes", tooltip: ToolTip.INVENTORY_NOTES},
            {name: "remove", label: "Remove", tooltip: ToolTip.INVENTORY_DELETE}
        ];

        return (
            <Auxil>
                <DialogContentText style={{marginBottom: '2vw'}}>
                    <span className={classes.SubHeader}>Manage your concentrated flavor inventory</span>
                </DialogContentText>
                <Table className={classes.Table}>
                    <TableHead>
                        <TableRow style={{height: '10px'}}>
                            {columns.map(column => (
                                <TableCell className={classes.TableCell}
                                           onClick={column.name !== 'remove' ? (e) => this.handleTableSort(e, column.name, "flavors") : null}
                                           key={column.name}>
                                    <div data-tip={column.tooltip}>{sort.col === column.name ? sort.asc ?
                                        <ArrowDropUp fontSize='inherit'/> :
                                        <ArrowDropDown fontSize='inherit'/> : null} {column.label}</div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(flav => {
                            return <TableRow style={{height: '10px'}} key={flav.id}>
                                {edit.row === data.indexOf(flav) && edit.cell === "vendor" ?
                                    <TableCell><Input
                                        keyDown={(e) => this.handleKeyDown(e, flav, 'vendor')}
                                        change={(e) => this.handleKeyDown(e, flav, 'vendor')}
                                        blur={this.handleBlur} autoFocus={true} classes={classes.Input}
                                        value={flav.vendor} focus={(e) => this.handleFocus(e)} maxLength="4"/></TableCell>
                                    : <TableCell className={classes.TableCell}
                                                 onClick={(e) => this.handleEditBegin(e, flav, "vendor")}>{flav.vendor}</TableCell>}
                                {edit.row === data.indexOf(flav) && edit.cell === "name" ?
                                    <TableCell><Input
                                        keyDown={(e) => this.handleKeyDown(e, flav, 'name')}
                                        change={(e) => this.handleKeyDown(e, flav, 'name')}
                                        blur={this.handleBlur} autoFocus={true} classes={classes.NameInput}
                                        value={flav.name} focus={(e) => this.handleFocus(e)}/></TableCell>
                                    : <TableCell className={classes.TableCell}
                                                 onClick={(e) => this.handleEditBegin(e, flav, "name")}>{flav.name}</TableCell>}
                                {edit.row === data.indexOf(flav) && edit.cell === "amount" ?
                                    <TableCell><Input
                                        keyDown={(e) => this.handleKeyDown(e, flav, 'amount')}
                                        change={(e) => this.handleKeyDown(e, flav, 'amount')}
                                        blur={this.handleBlur} autoFocus={true} classes={classes.Input}
                                        value={flav.amount} type="number" min="0" focus={(e) => this.handleFocus(e)}
                                        maxLength="4"/></TableCell>
                                    : <TableCell className={classes.TableCell}
                                                 onClick={(e) => this.handleEditBegin(e, flav, "amount")}>{round(flav.amount)}</TableCell>}
                                <TableCell className={classes.TableCell}><Auxil><span
                                    data-tip={ToolTip.INVENTORY_RECIPE_COUNT}>{flav.recipes}</span></Auxil></TableCell>
                                {edit.row === data.indexOf(flav) && edit.cell === "notes" ?
                                    <TableCell><Input
                                        keyDown={(e) => this.handleKeyDown(e, flav, 'notes')}
                                        change={(e) => this.handleKeyDown(e, flav, 'notes')}
                                        blur={this.handleBlur} autoFocus={true} classes={classes.NotesInput}
                                        value={flav.notes} type="text" min="0"
                                        focus={(e) => this.handleFocus(e)}/></TableCell>
                                    : <TableCell className={classes.TableCell}
                                                 onClick={(e) => this.handleEditBegin(e, flav, "notes")}>{flav.notes}</TableCell>}
                                <TableCell>
                                    <div data-tip={ToolTip.INVENTORY_DELETE}>
                                        <Delete fontSize="inherit" className={classes.IconBtn}
                                                onClick={(e) => this.handleDelete(e, flav)} color={"secondary"}/>
                                    </div>
                                </TableCell>
                            </TableRow>
                        })}
                        <TableRow>
                            <TableCell span={4}>
                                <span data-tip={ToolTip.INVENTORY_PLUS_BUTTON}>
                                    <button
                                        key="plusBtn"
                                        className={classes.PlusButton}
                                        onClick={this.handleAdd}
                                    >+</button>
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <ConfirmDialog open={deleteDialog} close={this.handleDelete} confirm={(e) => this.handleDeleteConfirm(e, deleteRow)}
                               message={deleteRow ? "Are you sure you want to delete " + deleteRow.vendor + " " + deleteRow.name + "?" : ''} />
            </Auxil>)
    }
}

export default InventoryFlavors;