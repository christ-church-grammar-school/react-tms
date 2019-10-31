import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {withAuthorization} from '../Session';

import './SubmissionView.css';

class SubmissionView extends React.Component {
  constructor(props) {
    super(props);

    const {group, student, submissionID, fileName} = this.props.match.params;
    this.group = group;
    this.student = student;
    this.submissionID = submissionID;
    this.fileName = fileName;

    this.storagePath = `${this.group}/${this.student}/${this.submissionID}/${this.fileName}`;

    this.state = {
      codeString: 'loading...',
    };
  }

  componentDidMount() {
    const ref = this.props.firebase.getStorageRef(this.storagePath);
    const T = this;
    ref.getDownloadURL().then(url => {
      fetch(url).then(response => {
        response.text().then(text => {
          T.setState({
            codeString: text,
          });
        });
      });
    }).catch(error => {
      alert(error.message);
      T.setState({
        codeString: error.message,
      });
    });
  }

  render() {
    return (
      <div>
        <h2>Submission View</h2>
        <table>
          <tbody>
            <tr>
              <td>Group: </td>
              <td>{this.group}</td>
            </tr>
            <tr>
              <td>Student: </td>
              <td>{this.student}</td>
            </tr>
            <tr>
              <td>Submission ID:</td>
              <td>{this.submissionID}</td>
            </tr>
          </tbody>
        </table>

        <SyntaxHighlighter style={docco}>
          {this.state.codeString}
        </SyntaxHighlighter>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(SubmissionView);
