import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './containers/Layout/Layout';
import Auth from './containers/Auth/Auth';
import LiquidLab from './containers/LiquidLab/LiquidLab';
import './App.css';

class App extends Component {
  render() {
      let routes =
          <Switch>
              <Route path="/login" component={Auth} />
              <Route path="/" component={LiquidLab} />
          </Switch>;
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

export default App;
