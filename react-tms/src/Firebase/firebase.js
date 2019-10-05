import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

import firebaseConfig from './firebase_config';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth;
    this.db = app.database;
    this.storage = app.storage;
  }

  // Authentication api

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth().signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    this.auth().signOut();

  // Storage api

  // Returns a Cloud Firestore ref object pertaining to the file/folder within
  // the firestore at a given path.
  //
  // Args:
  //   path: The aforementioned path which 
  //
  getStorageRef(path) {
    const storageRootRef = this.storage().ref();
    return storageRootRef.child(path);
  }

  // Returns a reference to the root of the Cloud Firestore.
  //
  getStorageRoot() {
    return this.storage().ref();
  }
}

export default Firebase;
