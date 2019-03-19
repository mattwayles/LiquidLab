//React imports
import React from 'react';

//@material-ui/core Imports
import {
    Dialog, DialogActions,
    DialogTitle, DialogContent, DialogContentText
} from "@material-ui/core";
import Button from "../ui/Button/Button";


/**
 * Produce a dialog box and execute an operation when a button is pressed.
 */
const createNewRecipeDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.message}</DialogTitle>
            {props.subtitle ? <DialogContent>
                <DialogContentText>
                {props.subtitle}
            </DialogContentText>
            </DialogContent>: null }
            <DialogActions>
                <Button classname="Dialog" clicked={props.close}>
                    Cancel
                </Button>
                <Button classname="Dialog" clicked={() => props.overwrite(false)}>
                    Save New
                </Button>
                <Button classname="Dialog" clicked={() => props.overwrite(true)}>
                    Overwrite
                </Button>
            </DialogActions>
        </Dialog>
    );

export default createNewRecipeDialog ;