import React from 'react'
import classes from './Auth.css';
import { NavLink } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import Spinner from "../../components/ui/Spinner/Spinner";
import Auxil from "../../hoc/Auxil";
import Button from "../../components/ui/Button/Button";
import {validateLoginInput} from "../../util/userInputUtil";

/**
 * Login Container
 */
class Login extends React.Component {
    state = {
        email: "",
        password: "",
        clientError: ""
    };

    componentWillMount() {
        console.log("MOUNTING");
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
     * Handler for user press of the Submit button
     */
    handleSubmit = () => {
        let invalid = validateLoginInput(this.state.email, this.state.password);
        
        if (invalid) {
            this.setState({ clientError: invalid });
        } else {
            this.props.onLogin(this.state.email, this.state.password);
        }
    };


    render() {
        const { email, password, clientError } = this.state;
        const { error, loading } = this.props;

        let inputError = error || clientError;

        return (
            <div className={classes.Auth}>
                <p className={classes.Label}>Welcome Back! Login to your account:</p>
                { inputError ? <p className={classes.Error}>&#9888;&emsp;{inputError}</p> : null}
                {loading ? <Spinner /> : <Auxil>
                    <UserInput
                        autofocus={true}
                        type="string"
                        id="email"
                        value={email}
                        invalid={inputError && inputError.includes("E-Mail")}
                        change={(e) => this.handleUserInput(e, "email")}
                        placeholder="E-Mail Address"
                    />
                    <UserInput
                        type="password"
                        id="password"
                        value={password}
                        invalid={inputError && inputError.includes("password")}
                        change={(e) => this.handleUserInput(e, "password")}
                        placeholder="Password"
                    />
                    <Button classname="Login" clicked={this.handleSubmit}>Login</Button><br />
                    <NavLink to="/forgotPassword"><p style={{marginBottom: '10px'}}>Forgot Password?</p></NavLink>
                    <NavLink to="/register">Register New Account</NavLink>
                </Auxil>}
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
        onLogin: (email, password) => dispatch(actions.login(email, password)),
        clearAuthError: () => dispatch(actions.clearAuthError())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);