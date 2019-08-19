import React from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import './Login.css';

const INITIAL_STATE = {
  authError: false,
  email: '',
  password: '',
};

class LoginBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};

    this.cancelAuthError = this.cancelAuthError.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  cancelAuthError() {
    this.setState({authError: false});
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    const loginComponent = this;
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(function() {
        loginComponent.setState({...INITIAL_STATE});
        loginComponent.props.history.push('/');
      }).catch(function(error) {
        loginComponent.setState({authError: true});
        loginComponent.refs.emailInput.value = '';
        loginComponent.refs.passwordInput.value = '';
      });
    event.preventDefault();
  }

  render() {
    const { authError } = this.state;

    return (
      <div className="Login">
        <h1>Log in</h1>
        <form className="form-main" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            {authError &&
              <div className="auth-fail">
                <p>Authentication Failed.</p>
                <button onClick={this.cancelAuthError}>
                  ✖
                </button>
              </div>
            }
            <input className="form-input"
                   name="email"
                   onChange={this.handleChange}
                   placeholder="Email"
                   ref="emailInput"
                   type="text" />
            <input className="form-input"
                   name="password"
                   onChange={this.handleChange}
                   ref="passwordInput"
                   placeholder="Password"
                   type="password" />
            <button className="form-btn" type="submit">
              Log in
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}

const Login = compose(
  withFirebase
)(LoginBase);

export default Login;
