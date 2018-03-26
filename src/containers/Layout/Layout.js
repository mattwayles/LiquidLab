import React, { Component } from 'react';
import Auxil from '../../hoc/Auxil';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        sideDrawerOpen: false
    };

    //Notice that this is an arrow function instead of straight JS. This is to avoid this.state returning null
    toggleSideDrawerHandler = () => {
        this.setState( { sideDrawerOpen: !this.state.sideDrawerOpen });
    };
    
    render() {
        return (
            <Auxil>
                <Toolbar clicked={this.toggleSideDrawerHandler} />
                <SideDrawer open={this.state.sideDrawerOpen} close={this.toggleSideDrawerHandler} />
                <main>
                    {this.props.children}
                </main>
            </Auxil>
        );
    }
}


export default Layout;