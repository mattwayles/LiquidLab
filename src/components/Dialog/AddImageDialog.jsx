//React imports
import React from 'react';

//@material-ui/core Imports
import {
    Dialog, DialogActions,
    DialogTitle, DialogContent
} from "@material-ui/core";
import Button from "../ui/Button/Button";


/**
 * Produce a dialog box and execute an operation when a button is pressed.
 */
const addImageDialog = (props) => (
        <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.message}</DialogTitle>
            <DialogContent>
                <div style={{display: 'flex', flexFlow: 'row', margin: '2%', width: '65%'}}>
                    <input placeholder="Recipe Image" value={props.imgFile ? props.imgFile.name : ''} style={{margin: '0 3% 0 0', width: '70%'}} />
                    <input type="file" onChange={props.uploadImg} ref={(ref) => this.upload = ref} style={{display: 'none'}} />
                    <Button classname="Round" clicked={(e) => this.upload.click(e) } >...</Button>
                </div>
            </DialogContent>
            <DialogActions>
                <Button clicked={props.confirm} color="primary">
                    No, thanks
                </Button>
                <Button clicked={props.confirm}  color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );

export default addImageDialog ;