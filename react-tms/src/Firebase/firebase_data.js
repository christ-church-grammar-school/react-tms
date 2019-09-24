const admin = require('firebase-admin');

let serviceAccount = require('./credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

class Test {
  constructor(item) {
    this.title = item.title;
    this.input = item.input;
    this.output = item.output;
    this.start = item.start;
    this.end = item.end;
  }
}

class TestSequence {
  constructor(path) {
    this.path = path;
    this.tests = {};
  }

  updateTests() {
    this.collection.forEach((item) => {
      this.tests[item.title] = new Test(item);
    })
  }

  latest() {
    const final = [];
    db.collection(this.path).get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let test = new Test(doc.data())
          final.push(test);
        });
        this.collection = final;
        this.updateTests();
      })
      .catch((err) => {
        console.log('Error getting documents', err);
        return null;
      })
  }
}

const seq = new TestSequence('/classes/10ASD1_2019/tests');
seq.latest();

setTimeout(function() {
  console.log(seq)
  console.log(seq.tests['A Plus B'].input)
}, 5000)