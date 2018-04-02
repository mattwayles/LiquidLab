import React from'react';
import Auxil from '../../hoc/Auxil';

import classes from './ResultsControl.css';

const ResultsControl = (props) => {
    let calcResultStyle = null;
    if (!props.head) {
        calcResultStyle = classes.CalculationResult;
    }
    return (
        <div className={classes.ResultsControl}>
            <Auxil>
                <p style={{textAlign: 'right'}}>
                    {props.ven ? '[' + props.ven + ']' : null} {props.flavor}</p>
                <p className={calcResultStyle}>{props.ml}</p>
                <p className={calcResultStyle}>{props.grams}</p>
                <p className={calcResultStyle}>{props.percent}</p>
            </Auxil>
        </div>
    )
};


export default ResultsControl;
