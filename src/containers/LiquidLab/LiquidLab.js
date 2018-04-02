import React, { Component } from 'react';
import { connect } from 'react-redux';

import Formula from './Formula/Formula';
import Results from './Results/Results';

import classes from './LiquidLab.css';

class LiquidLab extends Component {
    state = {
        recipe: '',
        results: false
    }
    
    recipeSelectHandler(event) {
        this.setState({ recipe: event.target.value });
    }
    
    displayResultsHandler = () => {
        this.setState({ results: true })
    };
    
    render() {
        return (
            <div className={classes.LiquidLab}>
                <header className={classes.Header}>LiquidLab
                    <select value={this.state.recipe} onChange={(event) => this.recipeSelectHandler(event)}>
                        <option value="" disabled>Select a Recipe...</option>
                        <option value="Recipe1">Recipe1</option>
                        <option value="Recipe2">Recipe2</option>
                        <option value="Recipe3">Recipe3</option>
                    </select>
                </header>
                <div className={classes.Views}>
                    <Formula displayResults={this.displayResultsHandler} />
                    <div className={classes.Results}>
                        {this.state.results ? <Results /> : <p className={classes.Placeholder}>Results</p>}
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

export default connect(mapStateToProps)(LiquidLab);