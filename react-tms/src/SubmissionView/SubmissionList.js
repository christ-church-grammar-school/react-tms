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

class SubmissionList extends React.Component {
  constructor(props) {
    super(props);

    const {group} = this.props.match.params;

    this.group = group;

    this.state = {
      firebase: this.props.firebase,
    };
    if (this.group) {
      console.log(`Group: ${this.group}`)
    } else {
      console.log('No group')
    }

    this.tests = {};
    loadCollection(this.state.firebase, `classes/${group}/uploads`).then((children) => {
      for (const idx in children) {
        const child = children[idx]
        const [student, test, number] = child.split('_');
        loadDocument(this.state.firebase, `classes/${group}/uploads`, child).then((data) => {
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
        });
      }
    }).then(() => {
      console.log(this.tests);
    })
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(SubmissionList);
