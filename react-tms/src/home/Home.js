import React from 'react';

import { withAuthorization } from '../Session';

const HomePage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>This page is only accessible by every signed in user.</p>
  </div>
)

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
