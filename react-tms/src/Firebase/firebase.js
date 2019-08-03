import app from 'firebase/app';

import firebaseConfig from './firebase_config';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
  }
}

export default Firebase;
