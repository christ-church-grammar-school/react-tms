import React from 'react';

import { withAuthorization } from '../Session';

import './Home.css';

const HomePage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>This page is only accessible by every signed in user.</p>

    <table className="teaching-group-table">
      <tr>
        <h3>Your Classes:</h3>
      </tr>
      <tr>
        <p>10ASD1_2019</p>
      </tr>
    </table>
  </div>
)

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
