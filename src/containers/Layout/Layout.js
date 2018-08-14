import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Auxil from '../../hoc/Auxil';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

/**
 * Controls the higher-order layout, including the toolbar, sdiedrawer, and main components
 */
class Layout extends Component {
    state = {
        sideDrawerOpen: false
    };
    
    toggleSideDrawerHandler = () => {
        this.setState( { sideDrawerOpen: !this.state.sideDrawerOpen });
    };
    
    render() {
        return (
            <Auxil>
                <Toolbar isAuthenticated={this.props.isAuthenticated} clicked={this.toggleSideDrawerHandler} />
                <SideDrawer isAuthenticated={this.props.isAuthenticated} open={this.state.sideDrawerOpen} close={this.toggleSideDrawerHandler} />
                <main>
                    {this.props.children}
                </main> 
            </Auxil>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token != null
    }
};


export default withRouter(connect(mapStateToProps)(Layout));