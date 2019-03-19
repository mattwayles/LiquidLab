//React imports
import React from 'react';
import Warning from "@material-ui/icons/es/Warning";

//@material-ui/core Imports
import {
    Dialog, DialogActions,
    DialogTitle,
} from "@material-ui/core";
import Button from "../ui/Button/Button";


/**
 * Produce a dialog box and execute an operation when a button is pressed.
 */
const errorDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <Warning style={{margin: "4vh auto 0",width: "100%", textAlign: 'center', fontSize: '6vw', color: "gold"}} />
            <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>{props.message}</DialogTitle>
            <DialogActions>
                <Button classname="Dialog" clicked={props.close}>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );

export default errorDialog ;