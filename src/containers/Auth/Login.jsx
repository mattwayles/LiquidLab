import React from 'react'
import classes from './Auth.css';
import { NavLink } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import Spinner from "../../components/ui/Spinner/Spinner";
import Auxil from "../../hoc/Auxil";
import LoginButton from "../../components/ui/Button/LoginButton";


class Login extends React.Component {
    state = {
        email: "",
        password: ""
    };

    handleUserInput = (e, control) => {
        this.setState({ [control]: e.target.value});
    };

    handleSubmit = () => {
        this.props.onAuth(this.state.email, this.state.password);
    };


    render() {
        const { email, password } = this.state;
        const { error, loading } = this.props;

        return (
            <div className={classes.Auth}>
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
                    <LoginButton clicked={this.handleSubmit}>Login</LoginButton><br />
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
        onAuth: (email, password, register) => dispatch(actions.auth(email, password, register)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);