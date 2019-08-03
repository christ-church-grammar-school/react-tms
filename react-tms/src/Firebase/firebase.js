import app from 'firebase/app';
import 'firebase/auth';

import firebaseConfig from './firebase_config';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth;
  }

  // Authentication api

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth().signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    this.auth().signOut();
}

export default Firebase;
