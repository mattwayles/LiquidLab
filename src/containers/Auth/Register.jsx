import React from 'react'
import firebase from 'firebase';
import classes from './Auth.css';
import { NavLink } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import Spinner from "../../components/ui/Spinner/Spinner";
import Auxil from "../../hoc/Auxil";
import Button from "../../components/ui/Button/Button";


class Register extends React.Component {
    state = {
        email: "",
        password: "",
        error: null,
        loading: false,
        redirect: false
    };


    handleUserInput = (e, control) => {
        this.setState({ [control]: e.target.value});
    };

    handleSubmit = () => {
        this.setState({ error: null, loading: true });
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                    .then(() => {
                        this.setState({ redirect: true, loading: false });
                    })
                    .catch(error => {
                    this.setState({ error: error.message, loading: false });
                });
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
                <p className={classes.Label}>Register a new LiquidLab Account</p>
                { error ? <p className={classes.Error}>&#9888;&emsp;{error}</p> : null}
                {loading ? <Spinner/> :
                    <Auxil>
                        <UserInput
                            autofocus={true}
                            type="string"
                            id="email"
                            value={email}
                            invalid={error && error.includes("e-mail")}
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
                        <Button clicked={this.handleSubmit}>Register</Button><br />
                        <NavLink className={classes.NavLink} to="/login">Login to Existing Account</NavLink>
                    </Auxil>
                }
            </div>
        )
    }
}

export default (Register);