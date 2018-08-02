import React, { Component } from 'react';
import { connect } from 'react-redux';

import Formula from './Formula/Formula';
import Results from './Results/Results';
import errorImg from '../../assets/error.png';
import classes from './LiquidLab.css';
import * as actions from "../../store/actions";

class LiquidLab extends Component {
    state = {
        recipe: '',
        results: false,
        error: null
    };

    componentWillUpdate() {
        if (this.props.history.location.pathname === "/login") {
            this.props.history.push("/");
        }
    }

    recipeSelectHandler(event) {
        this.props.onSelectUserRecipe(this.props.userRecipes[event.target.value]);
    }
    
    displayResultsHandler = () => {
        this.setState({ results: true })
    };

    errorHandler = (error) => {
        this.setState({ error: error });
    };
    
    render() {
        const { recipe, results, error } = this.state;
        const { userRecipes } = this.props;

        return (
            <div className={classes.LiquidLab}>
                <header className={classes.Header}>ReactApp
                    <select value={recipe} onChange={(event) => this.recipeSelectHandler(event)}>
                        <option value="" disabled>Select a Recipe...</option>
                        {Object.keys(userRecipes).map(recipeKey => {
                            const recipe = userRecipes[recipeKey];
                            let recName = recipe.name.value;
                            recName = recipe.batch ? recName + recipe.batch.value : recName;
                            return <option key={recipeKey} value={recipeKey}>{recName}</option>
                        })}
                    </select>
                </header>
                <div className={classes.Views}>
                    <Formula displayResults={this.displayResultsHandler} error={this.errorHandler}/>
                    <div className={classes.Results}>
                        {results ? <Results /> : <p className={classes.Placeholder}>Results</p>}
                    </div>
                </div>
                {error ? <p className={classes.Error}><img className={classes.ErrorImg} src={errorImg} alt="!!!" /> {error}</p> : null}
            </div> 
        ); 
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        userRecipes: state.database.userRecipes
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectUserRecipe: (recipe) => dispatch(actions.selectUserRecipe(recipe))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LiquidLab);