import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ authUser }) => (
  <div>{authUser ? <HeaderAuthorized /> : <HeaderUnauthorized />}</div>
)

const HeaderAuthorized = () => (
  <nav className="Header">
    <Link to="/">
      <h1>react-tms</h1>
    </Link>
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
