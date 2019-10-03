import React from 'react';

import TextareaAutosize from 'react-autosize-textarea';

import './QuestionDesigner.css';

class QuestionDesigner extends React.Component {
  constructor(props) {
    super(props);

    this.questionStatementEditor = React.createRef();
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleStatementChange = this.handleStatementChange.bind(this);

    this.handleAddTestCase = this.handleAddTestCase.bind(this);
    this.handleRemoveTestCase = this.handleRemoveTestCase.bind(this);
    this.handleTestCaseInputChange = this.handleTestCaseInputChange.bind(this);
    this.handleTestCaseOutputChange = this.handleTestCaseOutputChange
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
        <input className="QuestionTitleEditor"
               placeholder="Question Title"
               onChange={this.handleTitleChange} />
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

export default QuestionDesigner;
