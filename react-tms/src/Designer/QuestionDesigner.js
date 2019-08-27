import React from 'react';

import './QuestionDesigner.css';
import QuestionStatementEditor from './editor';

class QuestionDesigner extends React.Component {
  constructor(props) {
    super(props);

    this.questionStatementEditor = React.createRef();
    this.handleTitleChange = this.handleTitleChange.bind(this);

    this.state = {
      questionTitle: '',
    }
  }

  handleTitleChange(event) {
    this.setState({ questionTitle: event.target.value });
  }

  render() {
    return (
      <div>
        <input className="QuestionTitleEditor"
               placeholder="Question Title" />
        <QuestionStatementEditor />
      </div>
    );
  }
}

export default QuestionDesigner;
