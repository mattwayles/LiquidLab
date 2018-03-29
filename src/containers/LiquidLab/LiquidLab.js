import React, { Component } from 'react';
import { connect } from 'react-redux';

import Formula from './Formula/Formula';

import classes from './LiquidLab.css';

class Main extends Component {
    render() {
        return (
            <div className={classes.LiquidLab}>
                <header className={classes.Header}>ReactApp
                    <select value="">
                        <option value="" disabled>Select A Recipe</option>
                        <option value="Recipe1">Recipe1</option>
                        <option value="Recipe2">Recipe2</option>
                        <option value="Recipe3">Recipe3</option>
                    </select>
                </header>
                <div className={classes.Views}>
                    <Formula />
                <div className={classes.Results}>
                    <p>Results</p>
                </div>
                    </div>
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