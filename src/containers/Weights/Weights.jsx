import React from 'react';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText} from "@material-ui/core";
import {connect} from "react-redux";
import classes from './Weights.css';
import * as ToolTip from '../../constants/Tooltip'
import * as actions from "../../store/actions";
import Input from "../../components/ui/Input/Input";
import Button from "../../components/ui/Button/Button";
import {enforceInputConstraints} from "../../util/shared";
import ErrorDialog from "../../components/Dialog/ErrorDialog";

/**
 * Display and set the ingredient Weights
 */
class Weights extends React.Component {
    state = {
        weights: {
            pgWeight: '',
            vgWeight: '',
            flavorWeight: '',
            nicStrength: '',
            nicBasePg: '',
            nicBaseVg: '',
            nicWeight: ''
        },
        valid: true,
        error: false,
    };

    /**
     * Handler for user input in this page's controls
     * @param e The user input event
     * @param control   The control receiving the event
     */
    handleUserInput = (e, control) => {
        e.target.value = enforceInputConstraints(e.target.value, e.target.maxLength);

        let valid = e.target.value >= 0;
        if (control === 'nicBasePg') {
            valid = +e.target.value + +this.state.weights.nicBaseVg === 100;
        }
        else if (control === 'nicBaseVg') {
            valid = +e.target.value + +this.state.weights.nicBasePg === 100;
        }
        this.setState({ valid: valid, weights: {...this.state.weights, [control]: e.target.value}});
    };

    /**
     * When this page is closed, return to the main page
     */
    handleClose = () => {
        this.props.history.push("/")
    };

    handleError = () => {
        this.setState({ error: false });
    };

    /**
     * Set the new weights to redux and database
     */
    handleSetWeights = () => {
        if (this.state.valid) {
            let weights = null;
            for (let stateProp in this.state.weights) {
                if (this.state.weights[stateProp] !== '') {
                    weights = {...weights, [stateProp]: parseInt(this.state.weights[stateProp], 10)}
                }
                else {
                    for (let reduxProp in this.props.weights) {
                        if (reduxProp === stateProp) {
                            weights = {...weights, [reduxProp]: this.props.weights[reduxProp]}
                        }
                    }
                }
            }

            if (this.props.isAuthenticated) {
                this.props.onSetDbWeights(this.props.token, this.props.dbEntryId, weights);
            }
            else {
                this.props.onSetReduxWeights(weights);
            }
            this.props.history.push("/");
        } else {
            this.setState({ error: true });
        }
    };



    render() {
        const { weights } = this.props;

        return(
            <Dialog open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle style={{marginTop: '1vw'}}><span className={classes.Header}>Set Weights</span></DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginBottom: '2vw'}}>
                        <span className={classes.SubHeader}>Configure weights for each recipe ingredient</span>
                    </DialogContentText>
                    <div className={classes.WeightControl}>
                        <p>Propylene Glycol (PG):</p>
                        <Input tooltip={ToolTip.WEIGHT_PG}
                                value={this.state.weights.pgWeight} classes={classes.Input}
                               change={(e) => this.handleUserInput(e, 'pgWeight')} type='number'
                               maxLength={5} placeholder={weights.pgWeight} autoFocus/>
                        <p>g/ml</p>
                    </div>
                    <div className={classes.WeightControl}>
                        <p>Vegetable Glycerine (VG):</p>
                        <Input tooltip={ToolTip.WEIGHT_VG}
                            value={this.state.weights.vgWeight} classes={classes.Input}
                               change={(e) => this.handleUserInput(e, 'vgWeight')} type='number'
                               maxLength={5} placeholder={weights.vgWeight} />
                        <p>g/ml</p>
                    </div>
                    <div className={classes.WeightControl}>
                        <p>Flavor:</p>
                        <Input tooltip={ToolTip.WEIGHT_FLAVOR}
                            value={this.state.weights.flavorWeight} classes={classes.Input}
                               change={(e) => this.handleUserInput(e, 'flavorWeight')} type='number'
                               maxLength={5} placeholder={weights.flavorWeight} />
                        <p>g/ml</p>
                    </div>
                    <div className={classes.WeightControl}>
                        <p>Nicotine:</p>
                        <Input tooltip={ToolTip.WEIGHT_NIC}
                            value={this.state.weights.nicWeight} classes={classes.Input}
                               change={(e) => this.handleUserInput(e, 'nicWeight')} type='number'
                               maxLength={5} placeholder={weights.nicWeight} />
                        <p>g/ml</p>
                    </div>
                    <div className={classes.WeightControl}>
                        <p>Nicotine Strength:</p>
                        <Input tooltip={ToolTip.STRENGTH_NIC}
                            value={this.state.weights.nicStrength} classes={classes.Input}
                               change={(e) => this.handleUserInput(e, 'nicStrength')} type='number'
                               maxLength={5} placeholder={weights.nicStrength} />
                        <p>mg</p>
                    </div>
                    <div className={classes.WeightControl}>
                        <p>Nicotine Base (PG):</p>
                        <Input tooltip={ToolTip.PG_NIC}
                            value={this.state.weights.nicBasePg} valid={this.state.valid} classes={classes.Input}
                               change={(e) => this.handleUserInput(e, 'nicBasePg')} type='number'
                               maxLength={3} placeholder={weights.nicBasePg} />
                        <p>%</p>
                    </div>
                    <div className={classes.WeightControl}>
                        <p>Nicotine Base (VG):</p>
                        <Input tooltip={ToolTip.VG_NIC}
                            value={this.state.weights.nicBaseVg} valid={this.state.valid} classes={classes.Input}
                               change={(e) => this.handleUserInput(e, 'nicBaseVg')} type='number'
                               maxLength={3} placeholder={weights.nicBaseVg} />
                        <p>%</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button tooltip={ToolTip.CLOSE_BUTTON} classname="Dialog" clicked={this.handleClose} color="primary">
                        Close
                    </Button>
                    <Button tooltip={ToolTip.SET_WEIGHT_BUTTON} classname="Dialog" clicked={this.handleSetWeights} color="primary">
                        Set
                    </Button>
                </DialogActions>
                {this.state.error ? <ErrorDialog open={this.state.error} close={this.handleError}
                                                 message={"NIC Base PG and NIC Base VG must sum to 100"} /> : null}
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        weights: state.formula.weights,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSetDbWeights: (token, dbEntryId, weights) => dispatch(actions.setDbWeights(token, dbEntryId, weights)),
        onSetReduxWeights: (weights) => dispatch(actions.setWeightsRedux(weights))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Weights);