import os
import subprocess
from subprocess import Popen, PIPE, STDOUT

class Language(object):
  def __init__(self, name, version, cmd_cmpl, cmd_run, extensions):
    self.name = name
    self.version = version
    self.cmd_cmpl = cmd_cmpl
    self.cmd_run = cmd_run
    self.extensions = extensions
  
  def replace(self, file):
    filename, ext = os.path.splitext(file)
    self.cmd_cmpl = self.cmd_cmpl.replace('FILENAME', filename)
    self.cmd_cmpl = self.cmd_cmpl.replace('FILE', file)
    self.cmd_cmpl = self.cmd_cmpl.replace('EXT', ext)
    self.cmd_run = self.cmd_run.replace('FILENAME', filename)
    self.cmd_run = self.cmd_run.replace('FILE', file)
    self.cmd_run = self.cmd_run.replace('EXT', ext)

  def revert(self, file):
    filename, ext = os.path.splitext(file)
    self.cmd_cmpl = self.cmd_cmpl.replace(filename, 'FILENAME')
    self.cmd_cmpl = self.cmd_cmpl.replace(file, 'FILE')
    self.cmd_cmpl = self.cmd_cmpl.replace(ext, 'EXT')
    self.cmd_run = self.cmd_run.replace(filename, 'FILENAME')
    self.cmd_run = self.cmd_run.replace(file, 'FILE')
    self.cmd_run = self.cmd_run.replace(ext, 'EXT')

  def run(self, file, specified_input, specified_output):
    filename, ext = os.path.splitext(file)
    if ext != '':
      if ext in self.extensions:
        build = f'unshare -n -r '
        if self.cmd_cmpl != '':
          self.replace(file)
          Popen(f'{self.cmd_cmpl}', shell=True).wait()
          self.revert(file)
        
        self.replace(file)
        build += self.cmd_run
        print(build)
        process = Popen(build, shell=True, stdout=PIPE, stdin=PIPE, stderr=STDOUT)
        program_out = process.communicate(input=specified_input.encode())[0].decode().strip()
        # print('out', program_out)
        specified_output = specified_output.strip()
        program_out = program_out.strip()
        if specified_output != program_out:
          print(f'Test case failed, wanted [{specified_output}], but got [{program_out}]!')
          return False
        process.wait()
        self.revert(file)
      else:
        print('Extension not supported!')
    else:
      print('Could not find a file extension!')
    return True

python3_7_3 = Language('Python 3.7.3', '3.7.3', '', '/usr/bin/python3.7 FILE', ['.py'])
bf = Language('Brainf**k (BFC)', '', 'bfc FILE', './a.out; echo', ['.bf'])
cpp = Language('C++ (G++)', '11', 'g++ FILE -o FILENAMEcpp', 'FILENAMEcpp', ['.cpp'])
c = Language('C (GCC)', '9.1.0', 'gcc FILE -o FILENAMEc', './FILENAMEc', ['.c'])
zsh = Language('ZSH 5.7.1', '5.7.1', 'chmod +x FILE', './FILE', ['.sh'])
go = Language('Go', 'go1.12.7 linux/amd64', '', 'go run FILE', ['.go'])
nodejs = Language('NodeJS', 'v11.15.0', '', 'node FILE', ['.js'])
csharp = Language('C# (Mono)', 'Mono v5.20.1.0', 'mcs FILE', 'mono FILENAME.exe', ['.cs'])
rust = Language('Rust (RustC)', 'rustc 1.35.0', 'rustc FILE -o FILENAMErs', './FILENAMErs', ['.rs'])

def execute(file, specified_input, specified_output):
  filename, ext = os.path.splitext(file)
  if ext == '.bf':
    return bf.run(file, specified_input, specified_output)
  if ext == '.py':
    return python3_7_3.run(file, specified_input, specified_output)
  elif ext == '.cpp':
    return cpp.run(file, specified_input, specified_output)
  elif ext == '.c':
    return c.run(file, specified_input, specified_output)
  elif ext == '.sh':
    return zsh.run(file, specified_input, specified_output)
  elif ext == '.go':
    return go.run(file, specified_input, specified_output)
  elif ext == '.js':
    return nodejs.run(file, specified_input, specified_output)
  elif ext == '.cs':
    return csharp.run(file, specified_input, specified_output)
  elif ext == '.rs':
    return rust.run(file, specified_input, specified_output)
  else:
    print('Unsupported extension', ext)
    return False

def run_tests(source_code, dirname):
  inputs = open(f'tests/{dirname}/input.txt', 'r').readlines()
  outputs = open(f'tests/{dirname}/output.txt', 'r').readlines()
  failed = False
  assert len(inputs) == len(outputs)
  for i in range(len(inputs)):
    if not execute(source_code, f'{inputs[i].strip()}\n', f'{outputs[i].strip()}\n'):
      print("Test suite failed!")
      return False
  print('Test suite passed!')
  return True