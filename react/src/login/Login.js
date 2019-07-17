import React from 'react';
import './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.failedAuthentication = false;
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    if (this.state.username === '' || this.state.password === '') {
      this.failedAuthentication = true;
      event.preventDefault();
      this.forceUpdate();
      return;
    }
    // TODO(maxgodfrey2004): Implement this function (use props?)
  }

  render() {
    return (
      <div className="Login">
        <h1>Log in</h1>
        <form className="form-main" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            {this.failedAuthentication === true &&
              <div className="auth-fail">
                <p>Authentication Failed.</p>
              </div>
            }
            <input className="form-input"
                   onChange={this.handleUsernameChange}
                   placeholder="Username"
                   type="text" />
            <input className="form-input"
                   onChange={this.handlePasswordChange}
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

export default Login;
