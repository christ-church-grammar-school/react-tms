import React from 'react';

import { withFirebase } from '../Firebase';

const BTN_TRANSPARENT = {
  background: 'none',
  backgroundColor: 'transparent',
  border: '1px solid white',
  borderRadius: '5px',
  padding: '0.5em',
};

const LogoutButton = ({ firebase }) => (
  <button style={BTN_TRANSPARENT} onClick={firebase.doSignOut}>
    <h1>Log out</h1>
  </button>
);

export default withFirebase(LogoutButton);
