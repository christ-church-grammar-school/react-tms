import React from 'react';

import './QuestionDesigner.css';

class QuestionDesigner extends React.Component {
  constructor(props) {
    super(props);

    this.questionStatementEditor = React.createRef();
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleStatementChange = this.handleStatementChange.bind(this);

    this.state = {
      questionTitle: '',
      questionStatement: '',
    };
  }

  handleTitleChange(event) {
    this.setState({questionTitle: event.target.value});
  }

  handleStatementChange(event) {
    this.setState({questionStatement: event.target.value});
  }

  render() {
    return (
      <div className="EditorWrapper">
        <input className="QuestionTitleEditor"
               placeholder="Question Title"
               onChange={this.handleTitleChange} />
        <div>
          <textarea className="QuestionStatementEditor"
                    placeholder="Question Statement..."
                    onChange={this.handleStatementChange} />
        </div>
      </div>
    );
  }
}

export default QuestionDesigner;
