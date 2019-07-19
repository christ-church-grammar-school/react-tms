import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

class Header extends React.Component {
  render() {
    return (
      <nav className="Header">
        <Link to="/">
          <h1>react-tms</h1>
        </Link>
      </nav>
    );
  }
}

export default Header;
