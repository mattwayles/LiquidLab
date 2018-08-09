//React imports
import React from 'react';

//@material-ui/core Imports
import {
    Button,
    Dialog, DialogActions,
    DialogTitle, DialogContent
} from "@material-ui/core";


/**
 * Produce a dialog bog allowing user input and execute an operation when a button is pressed.
 */
const confirmDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.message}</DialogTitle>
            <DialogContent>
                {props.inventoryList.map(flavor => {
                    return <p style={{marginLeft: '5%'}} key={flavor.control}>{flavor.ven ? flavor.ven.value + " " + flavor.flavor.value : flavor.flavor.value}</p>
                })}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.confirm}  color="primary">
                    {props.recipeKey ? "Update" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );

export default confirmDialog ;