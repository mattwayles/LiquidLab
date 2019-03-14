import React from 'react';
import reactLogo from '../../../assets/logo.png';

import classes from './Logo.css';

const logo = (props) => (
    <img className={classes.Logo} onClick={() => props.history.push("/")} src={reactLogo} alt="React.js" />
);

export default logo;