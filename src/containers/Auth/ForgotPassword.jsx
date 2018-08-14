import React from 'react'
import classes from './Auth.css';
import Button from "../../components/ui/Button/Button";
import { NavLink } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import {connect} from "react-redux";
import firebase from 'firebase';

/**
 * Forgot Password container
 */
class ForgotPassword extends React.Component {
    state = {
        email: "",
    };

    /**
     * Update state when user input is entered
     * @param e The user input event
     * @param control   The container control receiving the input
     */
    handleUserInput = (e, control) => {
        this.setState({ [control]: e.target.value});
    };

    /**
     * Handler for user press of the Submit button
     */
    handleSubmit = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email).then(() => {
            console.log("E-mail Sent!");
        }).catch(error => {
            console.log(error);
        })
    };


    render() {
        const { email } = this.state;
        const { error } = this.props;



        return (
            <div className={classes.Auth}>
                <p className={classes.Label}>Enter E-Mail to retrieve your password:</p>
                { error ? <p className={classes.Error}>&#9888;&emsp;{error}</p> : null}
                <UserInput
                    type="string"
                    id="email"
                    value={email}
                    change={(e) => this.handleUserInput(e, "email")}
                    placeholder="E-Mail Address"
                />
                <Button clicked={this.handleSubmit}>Submit</Button><br />
                <NavLink className={classes.NavLink} to="/login"><p style={{marginBottom: '10px'}}>Login</p></NavLink>
                <NavLink to="/register">Register New Account</NavLink>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
    }
};

export default connect(mapStateToProps, null)(ForgotPassword);