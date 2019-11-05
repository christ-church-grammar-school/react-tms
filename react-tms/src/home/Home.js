import React from 'react';

import {Link} from 'react-router-dom';

import { withAuthorization } from '../Session';

import './Home.css';

const METADATA_TXT = {
  contentType: 'text/plain',
};

// Converts a given string to an array of Uint8 objects.
//
// This function enables us to write to the Cloud Firestore.
//
// Args:
//   s: The string which we convert to the bytearray.
//
function stringToUint8Array(s) {
  return new TextEncoder().encode(s);
}

const NEW_TEST_PROMPT = 'Please enter the name of the new test. NOTE: This cannot be changed later.';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.handleCreateNewTest = this.handleCreateNewTest.bind(this);

    this.state = {
      loading: true,
      teachingGroups: [],
      loadingTestView: true,
      tests: [],
    };
  }

  componentDidMount() {
    this.setState({
      loading: true,
      loadingTestView: true,
    });

    var teacherUid = this.props.firebase.auth().currentUser.uid;
    const teacherDoc = this.props.firebase.db().doc(`teachers/${teacherUid}`);

    teacherDoc.get().then(doc => {
      if (doc.exists) {
        this.setState({
          loading: false,
          teachingGroups: doc.data().classes,
        });
      } else {
        console.error('Cloud Firestore document [' + `teachers/${teacherUid}` +
                      '] does not exist.');
        this.setState({
          loading: false,
          teachingGroups: ['An error was encountered.'],
        });
      }
    });

    const testsRef = this.props.firebase.getStorageRef('tests/');
    const T = this;
    testsRef.listAll().then(function(res) {
      res.prefixes.forEach(function(folderRef) {
        T.state.tests.push(folderRef.name);
      });
      T.state.tests.sort();
      T.setState({
        loadingTestView: false,
      })
    });

    setTimeout(()=>{}, 1);

    this.forceUpdate();
  }

  // Handles the creation of a new test.
  handleCreateNewTest() {
    const newTestName = window.prompt(NEW_TEST_PROMPT);
    if (newTestName === undefined || newTestName === '' ||
        newTestName === null) {
      return;
    }
    const path = `tests/${newTestName}`;
    const newQuestionPath = `${path}/Question 0`;
    const newQuestionRef = this.props.firebase.getStorageRef(newQuestionPath);
    newQuestionRef.child('statement.txt')
      .put(stringToUint8Array('The question statement goes here'), METADATA_TXT)
      .then(() => {
        console.log('New test successfully created!');
      });
    this.setState({
      tests: this.state.tests.concat([newTestName]).sort()
    });
  }

  render() {
    var teachingGroupsAsHtml = [];
    if (this.state.teachingGroups.length > 0) {
      for (const [idx, tgroup] of this.state.teachingGroups.entries()) {
        teachingGroupsAsHtml.push(
          <tr key={idx}>
            <Link to={`/${tgroup}/submissions`}>
              {tgroup}
            </Link>
          </tr>
        );
      }
    } else {
      teachingGroupsAsHtml = [<tr key={0}>loading...</tr>];
    }

    var testsAsHtml = []
    if (this.state.loadingTestView) {
      testsAsHtml.push(
        <tr key={0}>loading...</tr>
      );
    } else if (this.state.teachingGroups.length > 0) {
      for (const [idx, tName] of this.state.tests.entries()) {
        testsAsHtml.push(
          <tr key={idx}>
            <Link to={`/designer/${tName}`}>
              {tName}
            </Link>
          </tr>
        )
      }
    } else {
      testsAsHtml.push(
        <tr key={0}>No tests available.</tr>
      )
    }

    return (
      <div className="HomeWrapper">
        <h1>Dashboard</h1>
        <p>This page is only accessible by every signed in user.</p>
        <br />
        <table className="teaching-group-table">
          <h3>Your Classes:</h3>
          {teachingGroupsAsHtml}
        </table>
        <br />
        <table className="teaching-group-table">
          <h3>All Tests:</h3>
          <button onClick={this.handleCreateNewTest}>
            New Test
          </button>
          {testsAsHtml}
        </table>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
