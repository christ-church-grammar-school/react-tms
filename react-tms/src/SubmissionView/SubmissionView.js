import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import {xcode} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import TextareaAutosize from 'react-autosize-textarea';

import {withAuthorization} from '../Session';

import './SubmissionView.css';

const METADATA_TXT = {
  contentType: 'text/plain',
};

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

class SubmissionView extends React.Component {
  constructor(props) {
    super(props);

    const {group, student, submissionID, fileName} = this.props.match.params;
    this.group = group;
    this.student = student;
    this.submissionID = submissionID;
    this.fileName = fileName;

    this.submissionPath = `${this.group}/${this.student}/${this.submissionID}`;
    this.storagePath = `${this.group}/${this.student}/${this.submissionID}/${this.fileName}`;

    this.feedbackEditorRef = React.createRef();
    this.fileType = getFileTypeFromExtension(this.fileName.split('.')[1]);

    this.handleSaveFeedback = this.handleSaveFeedback.bind(this);
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.handleDisplayFeedbackString = this.handleDisplayFeedbackString.bind(this);
    
    this.state = {
      codeString: 'loading...',
      feedbackString: 'loading...',
      feedbackUnsaved: false,
    };

    this.onWindowClose = e => {
      if (this.state.feedbackUnsaved) {
        e.preventDefault();
      }
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onWindowClose);

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

    const submissionRef = this.props.firebase.getStorageRef(this.submissionPath);
    submissionRef.child('feedback.txt').getDownloadURL().then(url => {
      fetch(url).then(response => {
        response.text().then(text => {
          this.handleDisplayFeedbackString(text);
        });
      });
    }).catch(error => {
      if (error.code !== 'storage/object-not-found') {
        alert(error.message);
        T.setState({
          feedbackString: '',
        });
      } else {
        // Feedback has not been provided for this question. This is okay.
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onWindowClose);
  }

  // Handles the change of the feedback textarea.
  //
  handleFeedbackChange(event) {
    this.handleDisplayFeedbackString(event.target.value);
    this.setState({
      feedbackUnsaved: true,
    })
  }

  // Handles a save of the feedback to Cloud Storage.
  //
  handleSaveFeedback() {
    // Delete `feedback.txt` if it already exists. We will then write another
    // `feedback.txt` in its absence.
    const submissionRef = this.props.firebase.getStorageRef(this.submissionPath);
    submissionRef.child('feedback.txt').put(
      stringToUint8Array(this.state.feedbackString),
      METADATA_TXT
    ).then(() => {
      console.log('Wrote feedback to cloud storage.');
    });
    this.setState({
      feedbackUnsaved: false,
    });
  }

  // Handles the displaying of feedback on the DOM.
  //
  handleDisplayFeedbackString(newString) {
    if (newString !== '' && newString !== null && newString !== undefined) {
      this.feedbackEditorRef.current.value = newString;
      this.setState({
        feedbackString: newString,
      });
    }
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

        <h3 className="LeftView">
          Code:
        </h3>
        <div className="CodeView">
          <SyntaxHighlighter language={this.fileType} style={xcode} showLineNumbers={true}>
            {this.state.codeString}
          </SyntaxHighlighter>
        </div>

        <h3 className="LeftView">
          Submission Feedback:
        </h3>
        <button onClick={this.handleSaveFeedback}>
          Save Feedback
        </button>
        <div className="FeedbackEditorWrapper">
          <TextareaAutosize className="FeedbackEditor"
                            placeholder="[OPTIONAL] Provide feedback here..."
                            onChange={this.handleFeedbackChange}
                            onResize={(e) => {}}
                            ref={this.feedbackEditorRef} />
        </div>
      </div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(SubmissionView);
