import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from 'firebase';

/**
 * Log a user out
 */
class Logout extends Component {
    componentDidMount() {
        this.props.onClearDbRedux();
        this.props.onClearRecipe();
        this.props.onClearInventory();
        firebase.auth().signOut().then(() => {
            this.props.onLogout();
        }).catch(error => {
            window.alert(error);
        })

    }

    render () {
        return <Redirect to="/" />;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
        onClearDbRedux: () => dispatch(actions.clearDbRedux()),
        onClearRecipe: () => dispatch(actions.clearRecipe()),
        onClearInventory: () => dispatch(actions.clearInventory()),
    }
};

export default connect(null, mapDispatchToProps)(Logout);
