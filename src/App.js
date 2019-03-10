import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Layout from './containers/Layout/Layout';
import About from './components/Support/Support';
import Logout from './containers/Auth/Logout';
import LiquidLab from './containers/LiquidLab/LiquidLab';
import './App.css';
import Register from "./containers/Auth/Register";
import Login from "./containers/Auth/Login";
import ForgotPassword from "./containers/Auth/ForgotPassword";
import Weights from "./containers/Weights/Weights";
import Inventory from "./containers/Inventory/Inventory";
import ShoppingList from "./containers/Inventory/ShoppingList";

class App extends Component {
    
  render() {
      //Set the accessible routes based on authentication status
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
                  <Route path="/support" component={About} />
                  <Route path="/inventory" component={Inventory} />
                  <Route path="/shopping" component={ShoppingList} />
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

export default (App);
