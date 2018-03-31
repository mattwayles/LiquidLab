import React from'react';
import Auxil from '../../hoc/Auxil';

import classes from './ResultsControl.css';

const ResultsControl = (props) => {
    return (
        <div className={classes.ResultsControl}>
            <Auxil>
                <p>{props.ven}</p>
                <p>{props.flavor}</p>
                <p>{props.ml}</p>
                <p>{props.grams}</p>
                <p>{props.percent}</p>
            </Auxil>
        </div>
    )
};


export default ResultsControl;
