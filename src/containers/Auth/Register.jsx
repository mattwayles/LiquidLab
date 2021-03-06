import React from 'react'
import classes from './Auth.css';
import { NavLink } from 'react-router-dom';
import UserInput from "../../components/ui/UserInput/UserInput";
import {connect} from "react-redux";
import * as actions from "../../store/actions";
import Spinner from "../../components/ui/Spinner/Spinner";
import Auxil from "../../hoc/Auxil";
import Button from "../../components/ui/Button/Button";


class Register extends React.Component {
    state = {
        email: "",
        password: ""
    };


    handleUserInput = (e, control) => {
        this.setState({ [control]: e.target.value});
    };

    handleSubmit = () => {
        this.props.onAuth(this.state.email, this.state.password, true, this.props.weights);
    };


    render() {
        const { email, password } = this.state;
        const { error, loading } = this.props;



        return (
            <div className={classes.Auth}>
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
                        < UserInput
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

const mapStateToProps = state => {
    return {
        weights: state.formula.weights,
        error: state.auth.error,
        loading: state.auth.loading
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, register, weights) => dispatch(actions.auth(email, password, register, weights)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);