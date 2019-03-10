import React from 'react'
import firebase from 'firebase';
import classes from './Auth.css';
import { NavLink } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import Spinner from "../../components/ui/Spinner/Spinner";
import Auxil from "../../hoc/Auxil";
import Button from "../../components/ui/Button/Button";

/**
 * Login Container
 */
class Login extends React.Component {
    state = {
        email: "",
        password: "",
        error: null,
        loading: false,
        redirect: false
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
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({ redirect: true, loading: false });
            })
            .catch(error => {
                this.setState({ error: error.message, loading: false });
            });
    };


    render() {
        const { email, password, error, loading, redirect } = this.state;

        return (
            <div className={classes.Auth}>
                {redirect ? <Redirect to="'/'" /> : null}
                <p className={classes.Label}>Welcome Back! Login to your account:</p>
                { error ? <p className={classes.Error}>&#9888;&emsp;{error}</p> : null}
                {loading ? <Spinner /> : <Auxil>
                    <UserInput
                        autofocus={true}
                        type="string"
                        id="email"
                        value={email}
                        invalid={error && error.includes("E-Mail")}
                        change={(e) => this.handleUserInput(e, "email")}
                        placeholder="E-Mail Address"
                    />
                    <UserInput
                        type="password"
                        id="password"
                        value={password}
                        invalid={error && error.includes("password")}
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

export default (Login);