import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from './header/Header';
import Login from './login/Login';
import { withFirebase } from './Firebase';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      authUser: null,
    };
  }

  componentDidMount() {
    const appComponent = this;
    this.props.firebase.auth().onAuthStateChanged(user => {
      user
        ? appComponent.setState({ authUser: user })
        : appComponent.setState({ authUser: null });
    });
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Header authUser={this.state.authUser} />
          <Switch>
            <Route exact path="/" />
            <Route path="/login" component={Login} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default withFirebase(App);
