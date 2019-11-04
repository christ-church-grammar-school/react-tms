import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import {xcode} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {withAuthorization} from '../Session';

import './SubmissionView.css';

// Returns the type of a file given the file's extension.
//
// Args:
//   extension: The file's extension.
//
function getFileTypeFromExtension(extension) {
  switch (extension) {
    case 'py':
      return 'python';
    case 'cs':
      return 'cs';
    case 'cc':
    case 'cpp':
      return 'cpp';
    case 'go':
      return 'go';
    case 'js':
      return 'js';
    default:
      return undefined;
  }
}

class SubmissionView extends React.Component {
  constructor(props) {
    super(props);

    const {group, student, submissionID, fileName} = this.props.match.params;
    this.group = group;
    this.student = student;
    this.submissionID = submissionID;
    this.fileName = fileName;

    this.storagePath = `${this.group}/${this.student}/${this.submissionID}/${this.fileName}`;

    this.fileType = getFileTypeFromExtension(this.fileName.split('.')[1]);

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
        <h2 className="PageTitle">
          Submission View
        </h2>
        <table className="SubmissionInformation">
          <tbody>
            <tr>
              <td className="CellBold">
                Group:
              </td>
              <td>{this.group}</td>
            </tr>
            <tr>
              <td className="CellBold">
                Student:
              </td>
              <td>{this.student}</td>
            </tr>
            <tr>
              <td className="CellBold">
                Submission ID:
              </td>
              <td>{this.submissionID}</td>
            </tr>
          </tbody>
        </table>

        <div className="CodeView">
          <SyntaxHighlighter language={this.fileType} style={xcode} showLineNumbers={true}>
            {this.state.codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(SubmissionView);
