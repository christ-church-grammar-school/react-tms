import React from 'react';

import {withAuthorization} from '../Session';

function loadCollection(firebase, path) {
  const db = firebase.db();
  const children = [];
  return new Promise((resolve, reject) => {
    db.collection(path).get().then(collection => {
      collection.forEach(child => {
        children.push(child.id);
      });
      resolve(children);
    });
  })
}

function loadDocument (firebase, path, id) {
  const db = firebase.db();
  const ref = db.collection(path).doc(id);
  return new Promise((resolve, reject) => {
    ref.get().then((doc) => {
      resolve(doc.data());
    })
  })
}

class Submission extends React.Component {
  constructor(props) {
    super(props);

    const time = this.props.time;
    const result = this.props.result;
    const graded = this.props.graded;

    if (graded) {
      this.name = `Graded submission (${result}%)`;
    } else {
      this.name = 'Ungraded submission';
    }
  }

  render() {
    return (
      <li>{this.name}</li>
    )
  }
}

class Student extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const submissions = [];
    const obj = this.props.obj;
    for (const item in obj) {
      submissions.push(
        <Submission time={obj[item].timestamp.toDate()} result={obj[item].result}
          graded={obj[item].graded} key={submissions.length}></Submission>
      )
    }
    return (
      <li>
        {this.props.name}
        <ol>{submissions}</ol>
      </li>
    )
  }
}

class Question extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const students = [];
    const obj = this.props.obj;

    for (const student in obj) {
      if (obj.hasOwnProperty(student)) {
        students.push(
          <Student name={student} obj={obj[student]} key={students.length}></Student>
        )
      }
    }
    return (
      <li>
        {this.props.name}
        <ul>{students}</ul>
      </li>
    )
  }
}

class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const questions = [];
    const obj = this.props.obj;
    for (const question in obj) {
      if (obj.hasOwnProperty(question)) {
        questions.push(
          <Question name={question} obj={obj[question]} key={questions.length}></Question>
        )
      }
    }
    return (
      <li>
        {this.props.name}
        <ul>
          {questions}
        </ul>
      </li>
    )
  }
}

class SubmissionList extends React.Component {
  constructor(props) {
    super(props);

    const {group} = this.props.match.params;

    this.group = group;

    this.state = {
      firebase: this.props.firebase,
    };

    this.tests = {};
    loadCollection(this.state.firebase, `classes/${group}/uploads`).then(async (children) => {
      for (const idx in children) {
        const child = children[idx]
        const [student, test, number] = child.split('_');
        await loadDocument(this.state.firebase, `classes/${group}/uploads`, child).then((data) => {
          if (!this.tests.hasOwnProperty(data.parent)) {
            this.tests[data.parent] = {};
          }
          if (!this.tests[data.parent].hasOwnProperty(test)) {
            this.tests[data.parent][test] = {};
          }
          if (!this.tests[data.parent][test].hasOwnProperty(student)) {
            this.tests[data.parent][test][student] = {};
          }

          this.tests[data.parent][test][student][number] = data;

          this.setState({
            tests: this.tests,
          });
        });
      }
    }).then(() => {
      const html = [];
      const tests = this.state.tests;
      for (const test in tests) {
        if (tests.hasOwnProperty(test)) {
          html.push(
            <Test obj={tests[test]} name={test} key={html.length}></Test>
          );
        }
      }
      this.setState({html: html})
    })
  }

  render() {
    return (
      <ul style={{textAlign: 'left'}}>
        {this.state.html}
      </ul>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(SubmissionList);
