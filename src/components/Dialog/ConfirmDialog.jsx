//React imports
import React from 'react';

//@material-ui/core Imports
import {
    Button,
    Dialog, DialogActions,
    DialogTitle,
} from "@material-ui/core";


/**
 * Produce a dialog bog allowing user input and execute an operation when a button is pressed.
 */
const confirmDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.message}</DialogTitle>
            <DialogActions>
                <Button onClick={props.close} color="primary">
                    No
                </Button>
                <Button onClick={props.confirm}  color="primary">
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );

export default confirmDialog ;