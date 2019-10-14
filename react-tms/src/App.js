import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './header/Header';
import Login from './login/Login';
import HomePage from './home/Home';
import TestDesigner from './Designer/TestDesigner';
import { withAuthentication } from './Session';
import './App.css';

const App = () => (
  <div className="App">
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/designer/:testName" component={TestDesigner} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default withAuthentication(App);
