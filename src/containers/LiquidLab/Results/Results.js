import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auxil from '../../../hoc/Auxil';
import ResultsControl from '../../../components/ResultsControl/ResultsControl';

import classes from './Results.css';

class Results extends Component {
    render () {
        /*console.log(
            "Recipe Name: ", this.props.results.name, this.props.results.batch,
            "\nNic ML: ", this.props.results.nic.ml +
            "\nNic Grams: ", this.props.results.nic.grams +
            "\nNic Percent: ", this.props.results.nic.percent +
            "\nPG ML: ", this.props.results.pg.ml +
            "\nPG Grams: ", this.props.results.pg.grams +
            "\nPG Percent: ", this.props.results.pg.percent +
            "\nVG ML: ", this.props.results.vg.ml +
            "\nVG Grams: ", this.props.results.vg.grams +
            "\nVG Percent: ", this.props.results.vg.percent
        );

        for (let i = 0; i < this.props.results.flavors.length; i++) {
            console.log(this.props.results.flavors[i]);
        }
        console.log("Notes: ", this.props.results.notes);*/

        let results = Object.keys(this.props.results.ingredients).map((item, index) => {
            if (item === 'flavors') {
                let flavors = this.props.results.ingredients.flavors.map((flavor, flavorIndex) => {
                    return <ResultsControl
                        key={flavorIndex}
                        ven={flavor.ven}
                        flavor={flavor.flavor}
                        ml={flavor.ml}
                        grams={flavor.grams}
                        percent={flavor.percent}
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
                    percent={this.props.results.ingredients[item].percent}/>
            }
        });

        return (
           <div className={classes.Results}>
               <Auxil>
                   <p className={classes.Header}>Results</p>
                   <ResultsControl ml="ML" grams="Grams" percent="%" />
                   {results}
                   <ResultsControl ven="test" flavor="Test Flavor" ml="15.7" grams="17.2" percent="5" />
               </Auxil>;
           </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        results: state.results
    }
};
export default connect(mapStateToProps)(Results);