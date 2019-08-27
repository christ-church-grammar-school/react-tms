import React from 'react';

import { withAuthorization } from '../Session';
import QuestionDesigner from './QuestionDesigner.js';

import './TestDesigner.css';

class TestDesigner extends React.Component {
  constructor(props) {
    super(props);

    this.questionDesigner = React.createRef();
    this.state = {
      selectedIndex: 0,
    }
  }

  render() {
    return (
      <div>
        <div className="TestDesignerSidebar">
          <ul>
            <li>Question 1</li>
          </ul>
        </div>
        <div className="RightAlignedContent">
          <QuestionDesigner ref={this.questionDesigner} />
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(TestDesigner);
