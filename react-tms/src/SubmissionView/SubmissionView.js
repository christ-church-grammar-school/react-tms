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

    this.state = {
      codeString: 'loading...',
    };
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
