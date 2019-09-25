const admin = require('firebase-admin');

let serviceAccount = require('./credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

/**
 * Writes the specified data to a document
 * @param {String} path The path of the document
 * @param {String} id The name of the document
 * @param {Object} data The data to write to the document
 */
function writeData(path, id, data) {
  db.collection(path).doc(id).set(data);
}

/**
 * Writes a complete question with test cases to the group's tests folder
 * @param {String} teachingGroup
 * @param {String} title
 * @param {String} body
 * @param {Array} inputs
 * @param {Array} outputs
 * @param {Date} start
 * @param {Date} end
 */
function writeQuestion(teachingGroup, title, body, inputs, outputs, start, end) {
  const name = title.toLowerCase().replace(/ /g, '');
  console.log(name)
  const data = {
    'title': title,
    'statement': body,
    'inputs': inputs,
    'outputs': outputs,
    'start': start,
    'end': end
  };
  writeData(`classes/${teachingGroup}/tests`, name, data);
}

export {writeQuestion};
