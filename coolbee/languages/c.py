import subprocess

from languages import BaseStrategy
from constants import *


class C(BaseStrategy):

    __python_extension = "c"
    __python_execute_extension = "o"

    def __init__(self):
        super(C, self).__init__(["o", "c"], "c")

    def execute(self, file_path, args=[]):
        full_command = [file_path]
        full_command.extend(args)

        # Execute command
        subprocess.Popen(full_command)
        exit()

    def execute_command(self, command, args=[]):
        filename = "{0}.{1}".format(MAIN_FILE_NAME, self.__python_execute_extension)

        # Get absolute path to target file
        file_path = os.path.join(COOLBEE_PATH,
                               FEATURE_DIR, command,
                               filename)

        self.execute(args=args, file_path=file_path)