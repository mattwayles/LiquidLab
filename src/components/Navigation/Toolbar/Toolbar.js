import React from 'react';

import Logo from '../../ui/Logo/Logo'
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from './../SideDrawer/DrawerToggle/DrawerToggle';
import classes from './Toolbar.css';

const toolbar = (props) => {

    return (
    <header className={classes.Toolbar} >
        <DrawerToggle clicked={props.clicked} />
        <div className={classes.Logo}>
            <Logo history={props.history}/>
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuthenticated} />
        </nav>
    </header>
    )};

export default toolbar;