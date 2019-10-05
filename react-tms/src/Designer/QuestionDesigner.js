import React from 'react';

import TextareaAutosize from 'react-autosize-textarea';

import {withAuthorization} from '../Session';

import './QuestionDesigner.css';

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

class QuestionDesigner extends React.Component {
  constructor(props) {
    super(props);

    this.testName = this.props.testName;
    if (this.testName === null || this.testName === undefined) {
      alert('QuestionDesigner.testName has not been set.');
    }

    this.questionStatementEditor = React.createRef();
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleStatementChange = this.handleStatementChange.bind(this);

    this.handleAddTestCase = this.handleAddTestCase.bind(this);
    this.handleRemoveTestCase = this.handleRemoveTestCase.bind(this);
    this.handleTestCaseInputChange = this.handleTestCaseInputChange.bind(this);
    this.handleTestCaseOutputChange = this.handleTestCaseOutputChange
      .bind(this);
    this.handleSaveToCloudFirestore = this.handleSaveToCloudFirestore
      .bind(this);

    this.state = {
      questionTitle: '',
      questionStatement: '',
      testCases: [],
    };
  }

  // Handles the addition of a test case to the dynamically rendered unit
  // tests.
  handleAddTestCase() {
    this.setState({
      testCases: this.state.testCases.concat([{input: '', output: ''}])
    });
  }

  // Handles the removal of a test case from the dynamically rendered unit
  // tests.
  // TODO: Refactor this function such that it is consistent with the other
  //       function declarations within this class (eg. such that it does not
  //       use arrow notation).
  handleRemoveTestCase = (idx) => () => {
    this.setState({
      testCases: this.state.testCases.filter((tc, tcIdx) => (tcIdx !== idx))
    });
  }

  // Handles the changing of a dynamically rendered test case's input field.
  // TODO: Refactor this function such that it is consistent with the other
  //       function declarations within this class (eg. such that it does not
  //       use arrow notation).
  handleTestCaseInputChange = (idx) => (event) => {
    const newTestCases = this.state.testCases.map((testCase, tcIdx) => {
      if (tcIdx !== idx) {
        return testCase;
      }
      return {...testCase, input: event.target.value};
    });
    this.setState({testCases: newTestCases});
  }

  // Handles the changing of a dynamically rendered test case's output field.
  // TODO: Refactor this function such that it is consistent with the other
  //       function declarations within this class (eg. such that it does not
  //       use arrow notation).
  handleTestCaseOutputChange = (idx) => (event) => {
    const newTestCases = this.state.testCases.map((testCase, tcIdx) => {
      if (tcIdx !== idx) {
        return testCase;
      }
      return {...testCase, output: event.target.value};
    });
    this.setState({testCases: newTestCases});
  }

  // Handles a change of the question title.
  handleTitleChange(event) {
    this.setState({questionTitle: event.target.value});
  }

  // Handles a change of the question's statement.
  handleStatementChange(event) {
    this.setState({questionStatement: event.target.value});
  }
  
  // Handles a save of the question and all appropriate test cases to the Cloud
  // Firestore.
  handleSaveToCloudFirestore() {
    const testsRef = this.props.firebase.getStorageRef('tests/');
    const questionPath = this.testName + '/' + this.state.questionTitle + '/';
    testsRef.child(questionPath).delete().then(() => {
      // Deletion occurred successfully.
    }).catch((err) => {
      if (err.code !== 'storage/object-not-found') {
        console.error(err);
      }
    });

    // Now we write to the database...
    // Firstly, we write the inputs:
    for (const [idx, testCase] of this.state.testCases.entries()) {
      const inputsRef = testsRef.child(questionPath + `inputs/case_${idx}.txt`);
      inputsRef.put(stringToUint8Array(testCase.input)).then(() => {
        console.log('Uploaded input to ' + inputsRef.fullPath);
      });
      const outputsRef = testsRef.child(questionPath + `outputs/case_${idx}.txt`);
      outputsRef.put(stringToUint8Array(testCase.output)).then(() => {
        console.log('Uploaded output to ' + outputsRef.fullPath);
      });
    }
    // Then, we write the question statement.
    const questionRef = testsRef.child(questionPath + 'statement.txt');
    questionRef.put(stringToUint8Array(this.state.questionStatement)).then(() => {
      console.log('Uploaded question statement to ' + questionRef.fullPath);
    })
  }

  render() {
    const testCasesAsHtml = [];
    for (const [idx, testCase] of this.state.testCases.entries()) {
      testCasesAsHtml.push(
        <div className="TestCase" key={idx}>
          <div className="TestCaseHeaderButtonWrapper">
            <h3>
              Test Case {idx + 1}
            </h3>
            <button className="TestCaseDeleteButton"
                    onClick={this.handleRemoveTestCase(idx)}>
              Delete
            </button>
          </div>
          <TextareaAutosize className="TestCaseInput"
                            placeholder="Input..."
                            onChange={this.handleTestCaseInputChange(idx)}
                            onResize={(e) => {}}
                            value={testCase.input}>
          </TextareaAutosize>
          <TextareaAutosize className="TestCaseOutput"
                            placeholder="Output..."
                            onChange={this.handleTestCaseOutputChange(idx)}
                            onResize={(e) => {}}
                            value={testCase.output}>
          </TextareaAutosize>
        </div>
      );
    }

    return (
      <div className="EditorWrapper">
        <div className="QuestionTitleWrapper">
          <input className="QuestionTitleEditor"
                 placeholder="Question Title"
                 onChange={this.handleTitleChange} />
          <button className="QuestionSaveButton"
                  onClick={this.handleSaveToCloudFirestore}>
            Save
          </button>
        </div>
        <div>
          <TextareaAutosize className="QuestionStatementEditor"
                            placeholder="Question Statement..."
                            onChange={this.handleStatementChange}
                            onResize={(e) => {}} />
        </div>

        <hr />
        <br />
        <h2 style={{'textAlign': 'left', 'marginBottom': '0.5em'}}>
          Test Cases
        </h2>

        {testCasesAsHtml}

        <div style={{'textAlign': 'center'}}>
          <button onClick={this.handleAddTestCase}>
            Add Test Case
          </button>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(QuestionDesigner);
