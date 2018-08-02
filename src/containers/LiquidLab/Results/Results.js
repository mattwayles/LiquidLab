import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auxil from '../../../hoc/Auxil';
import ResultsControl from '../../../components/ResultsControl/ResultsControl';

import classes from './Results.css';

class Results extends Component {
    render () {
        let results = Object.keys(this.props.results.ingredients).map((item, index) => {
            if (item === 'flavors') {
                let flavors = this.props.results.ingredients.flavors.map((flavor, flavorIndex) => {
                    let flavorName = 'No-Name Flavor';
                    if (flavor.flavor) {
                        flavorName = flavor.flavor;
                    }
                    return <ResultsControl
                        key={flavorIndex}
                        ven={flavor.ven}
                        flavor={flavorName}
                        ml={flavor.ml}
                        grams={flavor.grams}
                        percent={flavor.percent + '%'}
                        />
                });
                return flavors;
            }
            else {
                return <ResultsControl
                    key={index}
                    flavor={item.toUpperCase()}
                    ml={this.props.results.ingredients[item].ml}
                    grams={this.props.results.ingredients[item].grams}
                    percent={this.props.results.ingredients[item].percent + '%'}/>
            }
        });

        return (
            <Auxil>
                <p className={classes.Header}>
                    {this.props.results.recipeInfo.name.value + " "}
                    {this.props.results.recipeInfo.batch.value ?
                        <span style={{fontSize: '0.75em'}}>({this.props.results.recipeInfo.batch.value})</span>
                        : null}
                </p>
                {this.props.results.recipeInfo.notes ?
                    <p className={classes.Notes}><em>{this.props.results.recipeInfo.notes.value}</em></p> : null}
                <div className={classes.Results}>
                    <ResultsControl head ml="ML" grams="Grams" percent="%" />
                    {results}
                </div>
            </Auxil>
        );
    }
}

const mapStateToProps = state => {
    return {
        results: state.results
    }
};
export default connect(mapStateToProps)(Results);