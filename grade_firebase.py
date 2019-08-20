import os
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
def update_mark(transaction, grading_ref, result):
    transaction.update(grading_ref, {
        u'result': result,
        u'graded': True
    })

def grade_file_url(url, inputs, outputs):
    download = BUCKET.get_blob(url).download_as_string().decode('utf-8')
    filename = url.split('/')[-1]
    open('uploads/{}'.format(filename), 'w').write(download)
    filepath = os.path.join(os.path.join(
        os.path.dirname(os.path.realpath(__file__)), 'uploads/'),
                            filename)
    return run_tests(filepath, inputs, outputs)

def mark_student(student, class_name, inputs, outputs):
    student_upload = student.to_dict()
    student_upload_path = os.path.splitext(student_upload['refs'][0])[0].split('/')
    student_upload_str = student_upload_path[-3] + "_" + student_upload_path[-2]
    grading_path = u'classes/{}/uploads/{}/grading'.format(class_name, student_upload_str)
    grading_stream = DB.collection(grading_path).stream()

    for test in grading_stream:
        test_dict = test.to_dict()
        if not test_dict['graded']:
            result = grade_file_url(student_upload['refs'][0], inputs, outputs)
            update_mark(TRANSACTION, DB.collection(
                u'classes/{}/uploads/{}/grading'.format(
                    class_name, student_upload_str))
                        .document(u'test_1'), result)

def mark_class(class_name):
    class_ref = DB.collection(u'classes/{}/uploads'.format(class_name))
    class_stream = class_ref.stream()
    test_ref = DB.collection(u'classes/{}/tests'.format(class_name))
    test_stream = test_ref.stream()

    for upload in class_stream:
        for test in test_stream:
            data = test.to_dict()
            inputs = data['input']
            outputs = data['output']
            mark_student(upload, class_name, inputs, outputs)

mark_class('10ASD1_2019')