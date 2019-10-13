import os
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from google.cloud import storage
from language import run_tests

CRED = credentials.Certificate('credentials.json')

CLIENT = storage.Client()
BUCKET = CLIENT.get_bucket('react-tms.appspot.com')

firebase_admin.initialize_app(CRED)
DB = firestore.client()

TRANSACTION = DB.transaction()

@firestore.transactional #pylint: disable = no-member
def update_mark(transaction, ref, result, outputs):
    transaction.update(ref, {
        u'result': result,
        u'graded': True,
        u'outputs': outputs,
        u'graded_at': datetime.datetime.now()
    })

def get_blobs(path):
    files = []
    for blob in BUCKET.list_blobs(prefix=path):
        name = blob.name
        if name[-1] != '/':
            files.append(name)
    return files

def download_io(test_name, question_name):
    path = 'tests/{}/{}'.format(test_name, question_name)
    inputPath = '{}/inputs/'.format(path)
    outputPath = '{}/outputs/'.format(path)
    inputs = []
    outputs = []

    for path in get_blobs(inputPath):
        if path[-1] != '/':
            blob = BUCKET.get_blob(path).download_as_string().decode('utf-8')
            inputs.append(blob)
    for path in get_blobs(outputPath):
        if path[-1] != '/':
            blob = BUCKET.get_blob(path).download_as_string().decode('utf-8')
            outputs.append(blob)

    return (inputs, outputs)

def grade_file_url(url, inputs):
    download = BUCKET.get_blob(url).download_as_string().decode('utf-8')
    filename = url.split('/')[-1]
    open('uploads/{}'.format(filename), 'w').write(download)
    filepath = os.path.join(os.path.join(
        os.path.dirname(os.path.realpath(__file__)), 'uploads/'),
                            filename)
    return run_tests(filepath, inputs)

def mark_student(student, class_name, inputs, outputs):
    student_upload = student.to_dict()
    student_upload_path = os.path.splitext(student_upload['refs'][0])[0].split('/')
    student_upload_str = student_upload_path[-3] + "_" + student_upload_path[-2]
    correct = 0
    total = 0

    if 'graded' in student_upload:
        if student_upload['graded']:
            return
    results = grade_file_url(student_upload['refs'][0], inputs)
    for result in range(len(results)):
        if outputs[result] == results[result]:
            correct += 1
        total += 1
    update_mark(TRANSACTION, DB.collection(
        u'classes/{}/uploads'.format(
            class_name)).document(student.id), (correct / total) * 100, results)

def mark_class(class_name, test_name, question_name):
    class_ref = DB.collection(u'classes/{}/uploads'.format(class_name))
    class_stream = class_ref.stream()
    test_ref = DB.collection(u'classes/{}/tests'.format(class_name))
    test_stream = test_ref.stream()

    for upload in class_stream:
        # for test in test_stream:
        #     data = test.to_dict()
        inputs, outputs = download_io(test_name, question_name)
        mark_student(upload, class_name, inputs, outputs)

mark_class('10ASD2_2019', 'DemoTest', 'Only Four')
