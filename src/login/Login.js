import React from 'react';
import './Login.css';

class Login extends React.Component {
  submitForm() {
    // TODO(maxgodfrey2004): Implement this function (use props?)
  }

  render() {
    return (
      <div className="Login">
        <h1>Log in</h1>
        <form className="form-main" onSubmit={this.submitForm}>
          <fieldset className="form-group">
            <input class="form-input"
                   formControlName="username"
                   placeholder="Username"
                   type="text" />
            <input class="form-input"
                   formControlName="password"
                   placeholder="Password"
                   type="password" />
            <button class="form-btn" type="submit">
              Log in
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Login;
