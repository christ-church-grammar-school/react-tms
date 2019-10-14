import React from 'react';

import { withAuthorization } from '../Session';

import './Home.css';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

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
        })
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

  render() {
    var teachingGroupsAsHtml = [];
    if (this.state.teachingGroups.length > 0) {
      for (const [idx, tgroup] of this.state.teachingGroups.entries()) {
        teachingGroupsAsHtml.push(
          <tr key={idx}>{tgroup}</tr>
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
      for (const [idx, testName] of this.state.tests.entries()) {
        testsAsHtml.push(
          <tr key={idx}>{testName}</tr>
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
          {testsAsHtml}
        </table>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
