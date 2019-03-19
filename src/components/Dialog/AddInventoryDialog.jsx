//React imports
import React from 'react';
import * as classes from './AddInventoryDialog.css';

//@material-ui/core Imports
import {
    Dialog, DialogActions,
    DialogTitle, DialogContent
} from "@material-ui/core";
import Button from "../ui/Button/Button";
import Table from "@material-ui/core/es/Table/Table";
import TableHead from "@material-ui/core/es/TableHead/TableHead";
import TableRow from "@material-ui/core/es/TableRow/TableRow";
import TableCell from "@material-ui/core/es/TableCell/TableCell";
import TableBody from "@material-ui/core/es/TableBody/TableBody";
import Checkbox from "@material-ui/core/es/Checkbox/Checkbox";
import Input from "../ui/Input/Input";


/**
 * Produce a dialog box and execute an operation when a button is pressed.
 */
const confirmDialog = (props) => {


    //TODO:
    //Table sorting? This will involve modifying items by flavor name, not by index!
    //ToolTips?


    //TODO: Clean up this logic a bit, maybe move into Util?
    let addDisabled = false;
    let checkedFlavors = 0;
    for (let i in props.inventoryList) {
        if (props.inventoryList[i].checked) {
            checkedFlavors++;
            if (props.inventoryList[i].amount === 0) {
                addDisabled = true;
                break;
            }
        }
    }
    if (checkedFlavors === 0) {
        addDisabled = true;
    }


    return (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add the following flavors to inventory?</DialogTitle>
            <DialogContent>

                <Table>
                    <TableHead>
                        <TableRow style={{height: '10px'}}>
                                <TableCell>Add</TableCell>
                                <TableCell>Flavor</TableCell>
                                <TableCell>Initial Volume</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.inventoryList.map((flavor, index) => {
                            return <TableRow key={flavor.flavor.value}>
                                <TableCell><Checkbox checked={flavor.checked} onChange={(e) => props.inventoryChange(e, index, "checked")} /></TableCell>
                                <TableCell>{flavor.ven ? flavor.ven.value + " " + flavor.flavor.value : flavor.flavor.value}</TableCell>
                                    <TableCell>
                                        {flavor.checked ? <div className={classes.FlexTable}>
                                    <Input classes={classes.Input}
                                        change={(e) => props.inventoryChange(e, index, "amount")}
                                        type="number" min="0"
                                           value={flavor.amount ? flavor.amount : ''}
                                           placeholder="0"
                                        maxLength="5"/> <p>ml</p></div> : null}
                                        </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>

            </DialogContent>

            <DialogActions>
                <Button classname="Dialog" clicked={props.close}>
                    Cancel
                </Button>
                <Button classname="Dialog" clicked={() => props.save(false)}>
                    No
                </Button>
                <Button classname="Dialog" disabled={addDisabled} clicked={() => props.save(true)}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    )};

export default confirmDialog ;