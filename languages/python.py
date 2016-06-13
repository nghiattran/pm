import subprocess

from languages import BaseStrategy
from constants import *


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
        subprocess.Popen(full_command, env=current_env).communicate()

    def execute_command(self, command, args=[]):
        filename = "{0}.{1}".format(MAIN_FILE_NAME, self.__python_execute_extension)

        # Get absolute path to target file
        file_path = os.path.join(COOLBEE_PATH,
                               FEATURE_DIR, command,
                               filename)

        self.execute(args=args, file_path=file_path)