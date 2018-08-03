import React, { Component } from 'react';
import { connect } from 'react-redux';

import Formula from './Formula/Formula';
import Results from './Results/Results';
import errorImg from '../../assets/error.png';
import classes from './LiquidLab.css';
import * as actions from "../../store/actions";
import Input from "../../components/ui/Input/Input";

class LiquidLab extends Component {
    state = {
        recipe: '',
        results: false,
        error: null,
        mlToMake: 0
    };

    //TODO: 'Clear' Button
    //TODO: MLToMake maxLength
    //TODO: Refresh recipe list on creation
    //TODO: Brackets around batch in recipe list
    //TODO: Saving recipe should not empty fields
    //TODO: Success message on saving recipe
    //TODO: 'Save' Button should become 'Update'
    //TODO: Delete recipe
    //TODO: Warn when token is about to expire


    //TODO: Global flavors
    //TODO: Inventory, Shopping List, Weights, "What can I make?"
    //TODO: Browse global with intense search


    componentWillUpdate() {
        if (this.props.history.location.pathname === "/login") {
            this.props.history.push("/");
        }
    }

    dataEnteredHandler = (event) => {
            let valid = event.target.value >= 1;
            this.props.onDataEntered('mlToMake', this.props.mlToMake.value, valid);
    };

    recipeSelectHandler(event) {
        this.props.onSelectUserRecipe(this.props.userRecipes[event.target.value]);
        this.setState({ recipeSelected: true });
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
                <header className={classes.HeaderDiv}>
                    <p className={classes.Header}>ReactApp</p>
                    <div className={classes.MlToMake}>
                        <p>ML To Make:</p>
                        <Input classes={classes.Input} valid={error ? !error.includes("ML") : true}
                               change={(e) => this.dataEnteredHandler(e)} type={'number'}
                               maxLength={4} placeholder="0" autoFocus/>
                        <p>ml</p>
                    </div>
                    <select className={classes.Select} value={recipe} onChange={(event) => this.recipeSelectHandler(event)}>
                        <option value="" disabled>Select a Recipe...</option>
                        {userRecipes ? Object.keys(userRecipes).map(recipeKey => {
                            const recipe = userRecipes[recipeKey];
                            let recName = recipe.name.value;
                            recName = recipe.batch ? recName + recipe.batch.value : recName;
                            return <option key={recipeKey} value={recipeKey}>{recName}</option>
                        }) : null}
                    </select>
                </header>
                {error ? <p className={classes.Error}><img className={classes.ErrorImg} src={errorImg} alt="!!!" /> {error}</p> : null}
                <div className={classes.Views}>
                    <Formula displayResults={this.displayResultsHandler} error={this.errorHandler}/>
                    <div className={classes.Results}>
                        {results ? <Results /> : <p className={classes.Placeholder}>Results</p>}
                    </div>
                </div>
            </div> 
        ); 
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        token: state.auth.token,
        dbEntryId: state.database.dbEntryId,
        userRecipes: state.database.userRecipes,
        mlToMake: state.formula.inputs.mlToMake
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onSelectUserRecipe: (recipe) => dispatch(actions.selectUserRecipe(recipe)),
        onDataEntered: (control, value, valid) => dispatch(actions.inputDataEntered(control, value, valid))
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LiquidLab);