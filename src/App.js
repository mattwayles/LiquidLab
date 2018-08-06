import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import * as actions from './store/actions/index';
import Layout from './containers/Layout/Layout';
import About from './components/About/About';
import Logout from './containers/Auth/Logout';
import LiquidLab from './containers/LiquidLab/LiquidLab';
import './App.css';
import Register from "./containers/Auth/Register";
import Login from "./containers/Auth/Login";
import ForgotPassword from "./containers/Auth/ForgotPassword";
import Weights from "./containers/Weights/Weights";
import Inventory from "./containers/Inventory/Inventory";

class App extends Component {
    
    //Auto-Sign In if token is still active
    componentDidMount () {
        this.props.onTryAutoSignup();
    }
    
    
  render() {
      let routes =
          <Switch>
              <Route path="/register" component={Register} />
              <Route path="/forgotPassword" component={ForgotPassword} />
              <Route path="/login" component={Login} />
              <Route path="/about" component={About} />
              <Route path="/weights" component={Weights} />
              <Route path="/" exact component={LiquidLab} />
              <Redirect to="/" />
          </Switch>;
      if (this.props.isAuthenticated) {
          routes =
              <Switch>
                  <Route path="/about" component={About} />
                  <Route path="/inventory" component={Inventory} />
                  <Route path="/weights" component={Weights} />
                  <Route path="/logout" component={Logout} />
                  <Route path="/" component={LiquidLab} />
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
