import React from 'react'
import classes from './Auth.css';
import { NavLink } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import {connect} from "react-redux";
import * as ToolTip from '../../constants/Tooltip';
import * as actions from "../../store/actions";
import Spinner from "../../components/ui/Spinner/Spinner";
import Auxil from "../../hoc/Auxil";
import Button from "../../components/ui/Button/Button";
import {validateNewUserInput} from "../../util/userInputUtil";

/**
 * User Registration Container
 */
class Register extends React.Component {
    state = {
        username: "",
        email: "",
        verifyEmail: "",
        password: "",
        confirmPw: "",
        clientError: ""
    };

    /**
     * Clear any errors that may be lingering from previous login attempts or user registrations.
     */
    componentWillMount() {
        this.props.clearAuthError();
    }

    /**
     * Update state when user input is entered
     * @param e The user input event
     * @param control   The container control receiving the input
     */
    handleUserInput = (e, control) => {
        this.setState({ [control]: e.target.value});
    };

    /**
     * Validate user data and attempt registration when the Register button is pressed
     */
    handleSubmit = () => {
        let invalid = validateNewUserInput(
            this.state.username,
            this.state.email,
            this.state.verifyEmail,
            this.state.password,
            this.state.confirmPw);
        
        
        if (invalid) {
            this.setState({ clientError: invalid });
        } else {
            this.setState({ clientError: null });
            this.props.onRegister(this.state.username, this.state.email, this.state.password);
        }
    };

    /**
     * Handler for pressing the 'Enter' key inside any input box
     * @param event The key press event
     */
    enterKeyPressed = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    };


    render() {
        const { username, email, verifyEmail, password, confirmPw, clientError } = this.state;
        const { error, loading } = this.props;

        //Display any client - or - server side errors, with priority given to server
        let inputError = error || clientError;

        return (
            <div className={classes.Auth}>
                <p className={classes.Label}>Join the LiquidLab Community!</p>
                { inputError ? <p className={classes.Error}>&#9888;&emsp;{inputError}</p> : null}
                {loading ? <Spinner/> :
                    <Auxil>
                        <UserInput
                            tooltip={ToolTip.REGISTER_USERNAME}
                            autofocus={true}
                            type="string"
                            id="username"
                            value={username}
                            enter={this.enterKeyPressed}
                            invalid={inputError && inputError.includes("username")}
                            change={(e) => this.handleUserInput(e, "username")}
                            placeholder="Username *"
                        />
                        <UserInput
                            tooltip={ToolTip.REGISTER_EMAIL}
                            autofocus={false}
                            type="string"
                            id="email"
                            value={email}
                            enter={this.enterKeyPressed}
                            invalid={inputError && inputError.includes("e-mail")}
                            change={(e) => this.handleUserInput(e, "email")}
                            placeholder="E-Mail Address *"
                        />
                        <UserInput
                            tooltip={ToolTip.REGISTER_CONFIRM_EMAIL}
                            autofocus={false}
                            type="string"
                            id="verifyEmail"
                            value={verifyEmail}
                            enter={this.enterKeyPressed}
                            invalid={inputError && inputError.includes("verify e-mail")}
                            change={(e) => this.handleUserInput(e, "verifyEmail")}
                            placeholder="Verify E-Mail Address *"
                        />
                        <UserInput
                            tooltip={ToolTip.REGISTER_PASSWORD}
                            type="password"
                            id="password"
                            value={password}
                            enter={this.enterKeyPressed}
                            invalid={inputError && (inputError.includes("provided password") || inputError.includes("The password"))}
                            change={(e) => this.handleUserInput(e, "password")}
                            placeholder="Password *"
                        />
                        <UserInput
                            tooltip={ToolTip.REGISTER_CONFIRM_PASSWORD}
                            type="password"
                            id="confirm"
                            value={confirmPw}
                            enter={this.enterKeyPressed}
                            invalid={inputError && (inputError.includes("provided password") || inputError.includes("confirm"))}
                            change={(e) => this.handleUserInput(e, "confirmPw")}
                            placeholder="Confirm Password *"
                        />
                        <Button clicked={this.handleSubmit}>Register</Button><br />
                        <NavLink className={classes.NavLink} to="/login">Login to Existing Account</NavLink>
                    </Auxil>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        error: state.auth.error,
        loading: state.auth.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onRegister: (username, email, password) => dispatch(actions.register(username, email, password)),
        clearAuthError: () => dispatch(actions.clearAuthError())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);