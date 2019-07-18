"""Main logic for flask.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os

from flask import Flask, escape, request
from language import run_tests

app = Flask(__name__) # pylint: disable=invalid-name

ALLOWED_EXTENSIONS = frozenset([
    'txt',
    'py',
    'bf',
    'sh',
    'go',
    'c',
    'cs',
    'cpp',
    'rs',
    'js'
])

HTML_UPLOAD = '''
<!doctype html>
<title>Upload new File</title>
<h1>Upload new File</h1>
<form method=post enctype=multipart/form-data>
    <input type=file name=file>
    <input type=submit value=Upload>
</form>
'''

@app.route('/')
def hello():
    """Welcome the user.
    """
    name = request.args.get('name', 'World')
    print(request)
    return 'Hello, {}!'.format(escape(name))

def allowed_file(filename):
    """Checks if a file has a recognised extension or not.

    Args:
      filename: The name of the file we are checking.

    Returns:
      bool: True if the file has a recognised extension, otherwise false.
    """
    if '.' not in filename:
        return False
    return filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    """Grades an uploaded file by running it on specific tests.
    """

    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file_upload = request.files['file']
        if file_upload.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file_upload and allowed_file(file_upload.filename):
            filepath = os.path.join(os.path.join(
                os.path.dirname(os.path.realpath(__file__)), 'uploads/'),
                file_upload.filename)

            print('FILE PATH:', filepath)
            file_upload.save(filepath)
            run_tests(filepath, 'helloworld')

    return HTML_UPLOAD
