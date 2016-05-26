import subprocess, sys, os
from strategies import BaseStrategy
from utils.constants import *

class Python(BaseStrategy):

    def __init__(self):
        super(Python, self).__init__(["py", "pyc"], "python")

    def execute(self, args, command="main"):
        # Set up environment for subprocess
        current_env = os.environ.copy()
        current_env['PYTHONPATH'] = ':'.join(sys.path)

        # Get absolute path to target file
        file_path = os.path.join(BASE_PYTHON_PATH,
                               FEATURE_DIR, command,
                               MAIN_FILE_PYTHON_NAME)

        full_command = [PYTHON_COMMAND, file_path]
        full_command.extend(args)

        # Execute command
        subprocess.Popen(full_command, env=current_env)
        exit()
