import React from 'react';
import { Link } from 'react-router-dom';

import LogoutButton from '../logout/Logout.js';
import './Header.css';
import { AuthUserContext } from '../Session/index.js';

const Header = ({ authUser }) => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <HeaderAuthorized /> : <HeaderUnauthorized />
      }
    </AuthUserContext.Consumer>
  </div>
)

const HeaderAuthorized = () => (
  <nav className="Header">
    <Link to="/">
      <h1>react-tms</h1>
    </Link>
    <LogoutButton />
  </nav>
)

const HeaderUnauthorized = () => (
  <nav className="Header">
    <Link to="/">
      <h1>react-tms</h1>
    </Link>
    <Link to="/login">
      <h1>Log in</h1>
    </Link>
  </nav>
)

export default Header;
