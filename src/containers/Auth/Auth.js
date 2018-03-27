import React, { Component } from 'react';

import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import Spinner from '../../components/ui/Spinner/Spinner';

import ErrorMessage from '../../store/actions/error/errorMessage';
import * as errorTypes from '../../store/actions/error/errorTypes';
import * as actions from '../../store/actions/index';
import classes from './Auth.css';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        passwordRetrieve: null
    };

    componentDidMount () {
        this.props.onSetAuthRedirectPath();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.error) {
            this.props.clearError();
        }

        if (this.props !== nextProps) {
            const updatedState = {
                ...this.state
            };

            for (let control in updatedState.controls) {
                updatedState.controls[control].value = '';
                updatedState.controls[control].touched = false;
            }
            updatedState.passwordRetrieve = null;

            this.setState(updatedState);
        }
    }

    inputChangedHandler = (event, id) => {
        const updatedControls = updateObject(this.state.controls, {
            [id]: updateObject(this.state.controls[id], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[id].validation),
                touched: true
            })
        });
        this.setState({ controls: updatedControls });
    };

    submitHandler = (event) => {
        event.preventDefault();
        if (this.props.forgotPass) {
            //Developers: Use your backend server to send an e-mail
            console.log("Developers: Use your backend server to send an e-mail");
            if (!this.state.controls.email.value) {
                this.props.throwError(errorTypes.INVALID_EMAIL);
            }
            this.setState({ passwordRetrieve: this.state.controls.email.value });
        }
        else {
            this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.props.isRegister);
        }
    };


    render () {
        const formElements = [];
        for (let key in this.state.controls) {
            formElements.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        let label = 'Welcome Back! Login to your account:';
        let form = formElements.map(formElement => (
            <Input
                key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
        ));

        if (this.props.isRegister) {
            label = 'Register a new AuthTemplate Account:';
            form = formElements.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
            ));
        }

        let links = null;
        if (this.props.forgotPass) {
            label = 'Enter E-Mail to retrieve your password:';
            form = formElements.map(formElement => (
                formElement.id === 'email' ?
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
                : null
            ));
        }
        else {
            if (this.props.isRegister) {
                links = <NavLink className={classes.NavLink} to="/login">Login to Existing Account</NavLink>;
            }
            else {
                links = <div className={classes.Links}>
                    <NavLink className={classes.NavLink} to="/forgotPassword">Forgot
                        Password?</NavLink>
                    <NavLink className={classes.NavLink} to="/register">Register New Account</NavLink>
                </div>
            }
        }

        if (this.props.loading) {
            form= <Spinner />;
        }

        let actionMessage = null;
        let errorMessage = null;
        if (this.state.passwordRetrieve) {
            actionMessage = <p style={{color: 'var(--success-color'}}>A password retrieval e-mail has been sent to {this.state.passwordRetrieve}</p>;
        }
        else {
            if (this.props.error) {
                errorMessage = (
                    <p style={{color: 'var(--fail-color'}}>{this.props.error}</p>
                )
            }
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={ this.props.authRedirectPath }/>;
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {actionMessage}
                <form onSubmit={this.submitHandler}>
                    <p className={classes.Label}>{label}</p>
                    {errorMessage}
                    {form}
                    <Button>Submit</Button>
                </form>
                {links}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, register) => dispatch(actions.auth(email, password, register)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        throwError: (errorType) => dispatch(actions.authFailed(ErrorMessage(errorType))),
        clearError: () => dispatch(actions.clearError())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);