//React imports
import React from 'react';

//@material-ui/core Imports
import {
    Dialog, DialogActions,
    DialogTitle, DialogContent, DialogContentText
} from "@material-ui/core";
import Button from "../ui/Button/Button";
import Warning from "@material-ui/icons/es/Warning";


/**
 * Produce a dialog box and execute an operation when a button is pressed.
 */
const confirmDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <Warning style={{margin: "4vh auto 0",width: "100%", textAlign: 'center', fontSize: '6vw', color: "gold"}} />
            <DialogTitle id="form-dialog-title" style={{textAlign: 'center'}}>{props.message}</DialogTitle>
            {props.subtitle ? <DialogContent>
                <DialogContentText>
                {props.subtitle}
            </DialogContentText>
            </DialogContent>: null }
            <DialogActions>
                <Button classname="Dialog" clicked={props.close}>
                    No
                </Button>
                <Button classname="Dialog" clicked={props.confirm}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );

export default confirmDialog ;