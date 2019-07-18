"""Base functionality for running any language.
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
import sys

from subprocess import Popen, PIPE

class Operator(object):
    """Represents an operator which can be used to compile and run programs.

    Note: When passing file extensions to this class, they must have a leading
          `.` character (no backticks).
    Note: When passing compiler/interpreter commands to this class, make sure
          that they will be able to execute on your system!

    Args:
      name: The name of the compiler/interpreter we will interface with.
      version: The version of the aforementioned compiler/interpreter.
      cmd_cmpl: The command to compile a given program (if applicable).
      cmd_run: The command to run a given program.
      extensions: File extensions of the specific program we are targeting.
    """

    def __init__(self, name, version, cmd_cmpl, cmd_run, extensions):
        self.name = name
        self.version = version
        self.cmd_cmpl = cmd_cmpl
        self.cmd_run = cmd_run
        self.extensions = frozenset(extensions)

    def replace(self, filename):
        """Formats operator commands with a pertinent filename.

        Args:
          filename: The file name to format into compilation and run scripts.
        """
        name, ext = os.path.splitext(filename)
        self.cmd_cmpl = self.cmd_cmpl.replace('FILENAME', name)
        self.cmd_cmpl = self.cmd_cmpl.replace('FILE', filename)
        self.cmd_cmpl = self.cmd_cmpl.replace('EXT', ext)
        self.cmd_run = self.cmd_run.replace('FILENAME', name)
        self.cmd_run = self.cmd_run.replace('FILE', filename)
        self.cmd_run = self.cmd_run.replace('EXT', ext)

    def revert(self, filename):
        """Reverts operator commands to their original states.

        Args:
          file: The filename to remove from the compilatoin and run scripts.
        """
        name, ext = os.path.splitext(filename)
        self.cmd_cmpl = self.cmd_cmpl.replace(name, 'FILENAME')
        self.cmd_cmpl = self.cmd_cmpl.replace(filename, 'FILE')
        self.cmd_cmpl = self.cmd_cmpl.replace(ext, 'EXT')
        self.cmd_run = self.cmd_run.replace(name, 'FILENAME')
        self.cmd_run = self.cmd_run.replace(filename, 'FILE')
        self.cmd_run = self.cmd_run.replace(ext, 'EXT')

    def run(self, filename, specified_input, specified_output):
        """Runs a file according to a certain test case.

        A test case comprises specified input and output. The idea is that the
        program is provided with the input, and must then output value(s)
        according to the problem statement. If the program's output matches the
        specified output, then the program passes the test case.

        Args:
          filename: The name of the file to be run.
          specified_input: Specified input as described above.
          specified_output: Specified output as described above.

        Returns:
          bool: True if no errors occurred and the program passes the test case
                otherwise False.
        """

        _, ext = os.path.splitext(filename)
        if ext:
            if ext in self.extensions:
                if self.cmd_cmpl:
                    self.replace(filename)
                    print('COMPILATION COMMAND:', self.cmd_cmpl)
                    Popen(self.cmd_cmpl, shell=True).wait()
                    self.revert(filename)

                self.replace(filename)
                build = ''
                build += self.cmd_run
                print('BUILD COMMAND IS: {}'.format(build))
                process = Popen(build, shell=True, stdout=PIPE, stdin=PIPE,
                                stderr=sys.stderr)
                program_out = process.\
                    communicate(input=specified_input.encode())[0].decode()

                specified_output = specified_output.strip()
                program_out = program_out.strip()

                if specified_output != program_out:
                    print('INCORRECT RESPONSE: wanted [{}], but got [{}].'.
                          format(repr(specified_output),
                                 repr(program_out)))
                    return False
                process.wait()
                self.revert(filename)
            else:
                print('ERROR: Extension not supported.', file=sys.stderr)
                return False
        else:
            print('ERROR: No specified file extension.', file=sys.stderr)
            return False
        return True
