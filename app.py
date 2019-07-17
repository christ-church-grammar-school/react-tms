from flask import Flask, escape, request
import os

from language import *
python3_7_3 = Language('Python 3.7.3', '3.7.3', '', '/usr/bin/python3.7 FILE', ['.py'])

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    print(request)
    return f'Hello, {escape(name)}!'

ALLOWED_EXTENSIONS = ['txt', 'py', 'bf', 'sh', 'go', 'c', 'cs', 'cpp', 'rs', 'js']
def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filepath = os.path.join(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'uploads/'), file.filename)
            file.save(filepath)
            print(filepath)
            run_tests(filepath, 'helloworld')
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''
