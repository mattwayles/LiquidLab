//React imports
import React from 'react';

//@material-ui/core Imports
import {
    Dialog, DialogActions,
    DialogTitle,
} from "@material-ui/core";
import Button from "../ui/Button/Button";
import Error from "@material-ui/icons/es/Error";


/**
 * Produce a dialog box and execute an operation when a button is pressed.
 */
const errorDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <Error style={{margin: "4vh auto 0",width: "100%", textAlign: 'center', fontSize: '6vw', color: "red"}} />
            <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>{props.message}</DialogTitle>
            <DialogActions>
                <Button classname="Dialog" clicked={props.close}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );

export default errorDialog ;