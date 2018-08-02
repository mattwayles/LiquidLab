import React from 'react'
import classes from './Auth.css';
import Button from "../../components/ui/Button/Button";
import { NavLink } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import {connect} from "react-redux";


class Login extends React.Component {
    state = {
        email: "",
    };


    handleUserInput = (e, control) => {
        this.setState({ [control]: e.target.value});
    };

    handleSubmit = () => {
        //TODO: Forgot Password e-mail
        //TODO: E-mail front-end validation
        //Developers: Use your backend server to send an e-mail
        console.log("Developers: Use your backend server to send an e-mail");
        window.alert("No SMTP Server Configured. Contact your System Administrator");
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

export default connect(mapStateToProps, null)(Login);