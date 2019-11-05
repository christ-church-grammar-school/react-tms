import React from 'react';

import { withAuthorization } from '../Session';

import './ClassView.css';

class ClassView extends React.Component {
  constructor(props) {
    super(props);

    const {classID} = this.props.match.params;
    this.classID = classID;

    console.log('Viewing class', this.classID);

    this.state = {
      studentsArray: ['loading...'],
    };
  }

  componentDidMount() {
    this.setState({
      studentsArray: ['loading...'],
    });

    const studentsDocRef = this.props.firebase.db().doc(`classes/${this.classID}`);
    console.log(studentsDocRef);

    studentsDocRef.get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        this.setState({
          studentsArray: data.students,
        });
      } else {
        console.error('Document does not exist');
      }
    })
  }

  render() {
    const studentsAsHtml = [];
    console.log(this.state);
    for (const [idx, student] of this.state.studentsArray.entries()) {
      studentsAsHtml.push(
        <tr key={idx}>
          {student}
        </tr>
      );
    }

    return (
      <div>
        <h2 className="Heading">
          Class {this.classID}
        </h2>
        <h3>Students:</h3>
        <table className="StudentsHtmlView">
          <tbody>
            {studentsAsHtml}
          </tbody>
        </table>
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ClassView);
