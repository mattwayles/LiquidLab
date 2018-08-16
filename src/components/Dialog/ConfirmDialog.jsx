//React imports
import React from 'react';

//@material-ui/core Imports
import {
    Button,
    Dialog, DialogActions,
    DialogTitle, DialogContent, DialogContentText
} from "@material-ui/core";


/**
 * Produce a dialog box and execute an operation when a button is pressed.
 */
const confirmDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.message}</DialogTitle>
            {props.subtitle ? <DialogContent>
                <DialogContentText>
                {props.subtitle}
            </DialogContentText>
            </DialogContent>: null }
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