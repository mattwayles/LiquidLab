import React from 'react';
import liquidLabLogo from '../../../assets/logo.png';

import classes from './Logo.css';

const logo = (props) => (
    <img className={classes.Logo} src={liquidLabLogo} alt="LiquidLab" />
);

export default logo;