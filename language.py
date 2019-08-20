"""Functionality for running and testing supported languages.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
import sys

from language_operator import Operator

# Various compilers and interpreters for supported languages.
OPERATORS = {
    '.bf': Operator('Brainf**k (BFC)', '', 'bfc "FILE"', './a.out; echo',
                    ['.bf']),
    '.py': Operator('Python 3.7.3', '3.7.3', '', '/usr/bin/python3 "FILE"',
                    ['.py']),
    '.cpp': Operator('C++ (G++)', '11', 'g++ "FILE" -o "FILENAMEcpp"',
                     '"FILENAMEcpp"', ['.cpp']),
    '.c': Operator('C (GCC)', '9.1.0', 'gcc "FILE" -o "FILENAMEc"',
                   '"FILENAMEc"', ['.c']),
    '.sh': Operator('ZSH 5.7.1', '5.7.1', 'chmod +x "FILE"', '"FILE"',
                    ['.sh']),
    '.go': Operator('Go', 'go1.12.7 linux/amd64', '', 'go run "FILE"',
                    ['.go']),
    '.js': Operator('NodeJS', 'v11.15.0', '', 'node "FILE"', ['.js']),
    '.cs': Operator('C# (Mono)', 'Mono v5.20.1.0', 'mcs "FILE"',
                    'mono "FILENAME.exe"', ['.cs']),
    '.rs': Operator('Rust (RustC)', 'rustc 1.35.0',
                    'rustc "FILE" -o FILENAMErs', '"FILENAMErs"', ['.rs'])
}

def run_case(filename, specified_input, specified_output):
    """Runs a test case pertinent to a specific language.

    For more information on parameter naming, please see the method
    Operator.run() in operator.py.

    Args:
      filename: The name of the file we are testing.
      specified_input: Test case input.
      specified_output: Test case output.
    """

    _, ext = os.path.splitext(filename)
    if ext in OPERATORS:
        return OPERATORS[ext].run(filename, specified_input, specified_output)

    print('ERROR: Unsupported extension "{}"'.format(ext), file=sys.stderr)
    return False

def run_tests(filename, inputs, outputs):
    """Runs a batch of test cases pertinent to a specific language.

    For more information, see execute() in this module, and the method
    Operator.run() in operator.py.

    Args:
      filename: The name of the file we are running
    """

    assert len(inputs) == len(outputs), \
           'Disparity between input and output file count.'
    files = len(inputs)

    failed = 0
    passed = 0

    for i in range(files):
        if not run_case(filename, '{}\n'.format(inputs[i].strip()),
                        '{}\n'.format(outputs[i].strip())):
            print("CASE {}/{} FAILED.".format(i + 1, files))
            failed += 1
        else:
            print("CASE {}/{} PASSED.".format(i + 1, files))
            passed += 1
    print("{}/{} CASES PASSED".format(passed, files))
    return round(passed/(files) * 100)
