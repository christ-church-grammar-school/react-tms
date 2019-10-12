import React from 'react';

import { withAuthorization } from '../Session';

import './Home.css';

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      teachingGroups: [],
    };
  }

  componentDidMount() {
    this.setState({loading: true});

    var teacherUid = this.props.firebase.auth().currentUser.uid;

    console.log(this.props.firebase);

    const teacherDoc = this.props.firebase.db().doc(`teachers/${teacherUid}`);

    teacherDoc.get().then(doc => {
      console.log(doc.data());
      if (doc.exists) {
        this.setState({
          loading: false,
          teachingGroups: doc.data().classes,
        });
        console.log(this.state);
      } else {
        console.error('Cloud Firestore document [' + `teachers/${teacherUid}` +
                      '] does not exist.');
        this.setState({
          loading: false,
          teachingGroups: ['An error was encountered.'],
        })
      }
    });

    this.forceUpdate();
  }

  render() {
    console.log(this.state.teachingGroups);

    var teachingGroupsAsHtml = [];
    if (this.state.teachingGroups.length > 0) {
      for (const [idx, tgroup] of this.state.teachingGroups.entries()) {
        console.log('iterating over: ', tgroup);
        teachingGroupsAsHtml.push(
          <tr>{tgroup}</tr>
        );
      }
    } else {
      teachingGroupsAsHtml = [<tr>loading...</tr>];
    }

    return (
      <div>
        <h1>Dashboard</h1>
        <p>This page is only accessible by every signed in user.</p>

        <table className="teaching-group-table">
          <thead>
            <tr>
              <h3>Your Classes:</h3>
            </tr>
          </thead>
          {teachingGroupsAsHtml}
        </table>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
