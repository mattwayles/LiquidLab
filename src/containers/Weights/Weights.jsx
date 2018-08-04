import React from 'react';
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, TextField} from "@material-ui/core";
import {connect} from "react-redux";
import Button from "../../components/ui/Button/Button";

class Weights extends React.Component {
    state = {
        pgWeight: 1.04,
        vgWeight: 1.26,
        flavorWeight: 1,
        nicStrength: 100,
        nicBasePg: 0,
        nicBaseVg: 100,
        nicWeight: 1.24
    };

    handleUserInput = (e, control) => {
        this.setState({ [control]: e.target.value});
    };

    handleClose = () => {
        this.props.history.push("/")
    };

    handleSetWeights = () => {
        console.log("Setting weights, but not furreall");
        //TODO: Set weights action
    };



    render() {
        const { pgWeight, vgWeight, flavorWeight, nicStrength, nicBasePg, nicBaseVg, nicWeight } = this.state;

        return(
            <Dialog open={true} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle>Set Weights</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Configure weights for each recipe ingredient
                    </DialogContentText>
                    <TextField fullWidth autoFocus onChange={(e) => this.handleUserInput(e, "pgWeight")}
                               value={pgWeight}
                               id="pgWeight"
                               label="Propylene Glycol (PG) Weight"
                               type="number"
                               margin="normal"
                    />
                    <TextField fullWidth onChange={(e) => this.handleUserInput(e, "vgWeight")}
                               value={vgWeight}
                               id="vgWeight"
                               label="Vegetable Glycerine (VG) Weight"
                               type="number"
                               margin="normal"
                    />
                    <TextField fullWidth onChange={(e) => this.handleUserInput(e, "flavorWeight")}
                               value={flavorWeight}
                               id="flavorWeight"
                               label="Flavor Weight"
                               type="number"
                               margin="normal"
                    />
                    <TextField fullWidth onChange={(e) => this.handleUserInput(e, "nicWeight")}
                               value={nicWeight}
                               id="nicWeight"
                               label="Nicotine Weight"
                               type="number"
                               margin="normal"
                    />
                    <TextField fullWidth onChange={(e) => this.handleUserInput(e, "nicStrength")}
                               value={nicStrength}
                               id="nicStrength"
                               label="Nicotine Strength (mg)"
                               type="number"
                               margin="normal"
                    />
                    <TextField fullWidth onChange={(e) => this.handleUserInput(e, "nicBasePg")}
                               value={nicBasePg}
                               id="nicBasePg"
                               label="Nicotine Base PG %"
                               type="number"
                               margin="normal"
                    />
                    <TextField fullWidth onChange={(e) => this.handleUserInput(e, "nicBaseVg")}
                               value={nicBaseVg}
                               id="nicBaseVg"
                               label="Nicotine Base BG %"
                               type="number"
                               margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button clicked={this.handleClose} color="primary">
                        Close
                    </Button>
                    <Button clicked={this.handleSetWeights} color="primary">
                        Set
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
};

const mapDispatchToProps = dispatch => {
    return {

    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Weights);