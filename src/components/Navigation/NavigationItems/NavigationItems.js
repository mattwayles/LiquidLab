import React from 'react';
import Auxil from '../../../hoc/Auxil';
import NavigationItem from './NavigationItem/NavigationItem';

import classes from './NavigationItems.css';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/support">Support</NavigationItem>
        <NavigationItem link="/weights">Weights</NavigationItem>
        {props.isAuthenticated
            ? <Auxil>
                <NavigationItem link="/inventory">Inventory</NavigationItem>
                <NavigationItem link="/shopping">Shopping List</NavigationItem>
                <NavigationItem link="/logout">Logout</NavigationItem>
            </Auxil>
            : <Auxil>
                <NavigationItem link="/login">Login</NavigationItem>
                <NavigationItem link="/register">Register</NavigationItem>
        </Auxil>
        }
    </ul>
);

export default navigationItems;