//React imports
import React from 'react';
import errorImg from '../../assets/error.png';

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
            <DialogTitle id="form-dialog-title"><img style={{width: '2vw'}} src={errorImg} alt="!!!" />&emsp;<span style={{color: 'red'}}>{props.message}</span></DialogTitle>
            <DialogActions>
                <Button classname="Dialog" clicked={props.close}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );

export default errorDialog ;