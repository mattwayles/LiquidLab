import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Main.css';

class Main extends Component {
    render() {

        let status = <p style={{color: 'red'}}>Logged Out</p>;
        if (this.props.isAuthenticated) {
            status = <p style={{color: 'green'}}>Logged In</p>
        }
        return (
            <div className={classes.Main}>
                <p>Hello! This is a placeholder for the AuthTemplate app.</p>
                <br />
                <p>You are currently:</p>
                {status}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
};

export default connect(mapStateToProps)(Main);