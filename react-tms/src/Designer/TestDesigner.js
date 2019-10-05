import React from 'react';

import { withAuthorization } from '../Session';
import QuestionDesigner from './QuestionDesigner.js';

import '../w3.css';
import './TestDesigner.css';

const ADD_QUESTION_STYLES_OVERRIDE = {
  'fontSize': '17px',
  'textAlign': 'center',
};

const SIDEBAR_STYLES_OVERRIDE = {
  'backgroundColor': '#ebf2ff',
  'height': 'calc(100vh - 70px)',
  'width': '15em',
};

class TestDesigner extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddQuestion = this.handleAddQuestion.bind(this);
    this.state = {
      selectedIndex: 0,
      testName: '',
      questions: ['Question 1']
    };
  }

  handleAddQuestion() {
    this.state.questions.push(`Question ${this.state.questions.length + 1}`);
    this.forceUpdate();
  }

  render() {
    const questionsAsHtml = [];
    for (const [idx, val] of this.state.questions.entries()) {
      questionsAsHtml.push(
        <a href="#" className="w3-bar-item w3-button" key={idx}>
          {val}
        </a>
      );
    }

    return (
      <div>
        <div className="w3-sidebar w3-bar-block"
             style={SIDEBAR_STYLES_OVERRIDE}>
          <button className="w3-bar-item w3-button"
                  onClick={this.handleAddQuestion}
                  style={ADD_QUESTION_STYLES_OVERRIDE}>
            <b>Add Question</b>
          </button>
          {questionsAsHtml}
        </div>
        <div className="RightAlignedContent">
          <QuestionDesigner testName="DemoTest" />
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(TestDesigner);
