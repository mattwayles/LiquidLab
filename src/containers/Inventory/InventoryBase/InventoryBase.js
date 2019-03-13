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
import {enforceInputConstraints, round} from "../../../util/shared";
import {sortTable} from "../../../util/inventoryUtil";



class InventoryBase extends React.Component {
    state = {
        data: [],
        edit: {},
        sort: {col: "name", asc: true},
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
            if (this.state.edit.cell === 'name') {
                this.setState({edit: {...this.state.edit, cell: 'amount'}})
            }
            else if (this.state.edit.cell === 'amount') {
                this.setState({edit: {...this.state.edit, cell: 'notes'}})
            }
        }
        else if (event.keyCode === 13) {
            this.props.handleSaveInventory();
        }
        else {
            let value = enforceInputConstraints(event.target.value, event.target.maxLength);

            let copiedBase = this.state.data;
            for (let i in copiedBase) {
                if (copiedBase[i].id === row.id) {
                    copiedBase[i] = {...copiedBase[i], [control]: value}
                }
            }

            this.props.handleSetBase(copiedBase);
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
     * Sort the list by column click
     * @param e The column click event
     * @param column    The column to be sorted
     */
    handleTableSort = (e, column) => {
        const sortedTable = sortTable(this.state.data, column, this.state.sort);
        this.setState({ data: sortedTable.data, sort: sortedTable.sort });
    };

    render() {

        const { data, edit, sort} = this.state;
        const columns = [
            { name: "name", label: "Base Ingredient", tooltip: ToolTip.BASE_INGREDIENT },
            { name: "amount", label: "Amount Left (ml)", tooltip: ToolTip.BASE_AMOUNT_LEFT },
        ];
        
        return (
            <Auxil>
                <DialogContentText style={{marginBottom: '2vw'}}>
                    <span className={classes.SubHeader}>Manage your base ingredient inventory</span>
                </DialogContentText>
                <Table className={classes.Table}>
                    <TableHead>
                        <TableRow style={{height: '10px'}}>
                            {columns.map(column => (
                                <TableCell className={classes.TableCell}
                                           onClick={column.name !== 'remove' ? (e) => this.handleTableSort(e, column.name, "base") : null}
                                           key={column.name}>
                                    <div data-tip={column.tooltip}>{sort.col === column.name ? sort.asc ?
                                        <ArrowDropUp fontSize='inherit'/> :
                                        <ArrowDropDown fontSize='inherit'/> : null} {column.label}</div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(ing => {
                            return <TableRow style={{height: '10px'}} key={ing.name}>
                                <TableCell className={classes.TableCell}
                                           onClick={(e) => this.handleEditBegin(e, ing, "name")}>{ing.name}</TableCell>
                                {edit.row === data.indexOf(ing) && edit.cell === "amount" ?
                                    <TableCell><Input
                                        keyDown={(e) => this.handleKeyDown(e, ing, 'amount')}
                                        change={(e) => this.handleKeyDown(e, ing, 'amount')}
                                        blur={this.handleBlur} autoFocus={true} classes={classes.Input}
                                        value={ing.amount} type="text" min="0" focus={(e) => this.handleFocus(e)}
                                        maxLength="4"/></TableCell>
                                    : <TableCell className={classes.TableCell}
                                                 onClick={(e) => this.handleEditBegin(e, ing, "amount")}>{round(ing.amount)}</TableCell>}
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </Auxil>)
    }
}

export default (InventoryBase);