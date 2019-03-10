import React, { Component } from 'react';
import firebase from 'firebase';
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

    // componentDidUpdate () {
    //     console.log("UPDATING");
    //     firebase.auth().onAuthStateChanged(user => {
    //         if (user) {
    //             this.setState({ loggedInUser: user.email });
    //             // User is signed in.
    //             // var displayName = user.displayName;
    //             // var email = user.email;
    //             // var emailVerified = user.emailVerified;
    //             // var photoURL = user.photoURL;
    //             // var isAnonymous = user.isAnonymous;
    //             // var uid = user.uid;
    //             // var providerData = user.providerData;
    //             // // ...
    //         } else {
    //             // User is signed out.
    //             // ...
    //         }
    //     });
    // }
    
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