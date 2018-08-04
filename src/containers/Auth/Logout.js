import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
class Logout extends Component {
    componentDidMount() {
        this.props.onClearDbRedux();
        this.props.onClearRecipe();
        this.props.onLogout();
    }

    render () {
        return <Redirect to="/" />;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
        onClearDbRedux: () => dispatch(actions.clearDbRedux()),
        onClearRecipe: () => dispatch(actions.clearRecipe())
    }
};

export default connect(null, mapDispatchToProps)(Logout);
