import React from 'react';
import Auxil from '../../../hoc/Auxil';
import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/about">About</NavigationItem>
        {props.isAuthenticated
            ? <NavigationItem link="/logout">Logout</NavigationItem>
            : <Auxil>
            <NavigationItem link="/login">Login</NavigationItem>
            <NavigationItem link="/register">Register</NavigationItem>
        </Auxil>
        }
    </ul>
);

export default navigationItems;