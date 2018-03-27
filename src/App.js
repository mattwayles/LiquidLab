import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import * as actions from './store/actions/index';
import Layout from './containers/Layout/Layout';
import Auth from './containers/Auth/Auth';
import About from './components/About/About';
import Logout from './containers/Auth/Logout/Logout';
import Main from './containers/Main/Main';
import './App.css';

class App extends Component {
    
    //Auto-Sign In if token is still active
    componentDidMount () {
        this.props.onTryAutoSignup();
    }
    
    
  render() {
      let routes =
          <Switch>
              <Route path="/register" render={()=> <Auth isRegister /> } />
              <Route path="/forgotPassword" render={()=> <Auth forgotPass /> } />
              <Route path="/login" render={()=> <Auth /> } />
              <Route path="/about" component={About} />
              <Route path="/" exact component={Main} />
              <Redirect to="/" />
          </Switch>;
      if (this.props.isAuthenticated) {
          routes =
              <Switch>
                  <Route path="/about" component={About} />
                  <Route path="/logout" component={Logout} />
                  <Route path="/" component={Main} />
                  <Redirect to="/" />
              </Switch>;
      }

    return (
      <div className="App">
          <BrowserRouter>
            <Layout>
                {routes}
            </Layout>
          </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
