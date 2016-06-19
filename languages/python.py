import importlib
import subprocess

from languages import BaseStrategy
from constants import *
from commands import *

class Python(BaseStrategy):

    __python_extension = "py"
    __python_execute_extension = "py"

    def __init__(self):
        super(Python, self).__init__(["py", "pyc"], "python")

    def execute(self, file_path, args=[]):
        # Set up environment for subprocess
        current_env = os.environ.copy()
        current_env['PYTHONPATH'] = ':'.join([COOLBEE_BASE_PATH, COOLBEE_PATH])
        full_command = [PYTHON_COMMAND, file_path]
        full_command.extend(args)

        # Execute command
        # subprocess.Popen(full_command, env=current_env).communicate()
        path = '{0}.{1}.{2}'.format('commands', file_path, 'main')
        module = importlib.import_module(path)
        getattr(module, 'main')()


    def execute_command(self, command, args=[]):
        path = '{0}.{1}.{2}'.format('commands', command, 'main')
        module = importlib.import_module(path)
        getattr(module, 'main')()