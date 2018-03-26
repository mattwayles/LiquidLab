import React from 'react';

import Auxil from '../../../hoc/Auxil';
import Logo from '../../ui/Logo/Logo';
import Backdrop from '../../ui/Backdrop/Backdrop';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open]
    }
    return (
        <Auxil>
            <Backdrop show={props.open} close={props.close} />
            <div className={attachedClasses.join(' ')}>
                <div className={classes.Logo}>
                    <Logo />
                    <nav>
                        <NavigationItems />
                    </nav>
                </div>
            </div>
        </Auxil>
    );
};

export default sideDrawer;