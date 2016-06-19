#!/usr/bin/python

from sys import argv

import os, sys, os.path as path
from constants import MAIN_FILE_NAME, COMMAND_DIR, COOLBEE_PATH
from languages.python import Python
from utils import get_commands


def get_main_file(path):
    for filename in os.listdir(path):
        if filename.startswith(MAIN_FILE_NAME + "."):
            return filename
    return None

if __name__ == '__main__':

    # Pop file name
    argv.pop(0)

    # If no command specified, exec help for main
    if len(argv) == 0:
        Python().execute_command(args=argv, command="main")
        sys.exit(1)

    commands = get_commands()

    # Get the command
    command = argv[0]

    if command in commands:
        argv.pop(0)

        Python().execute_command(command=command)
    else:
        Python().execute_command(command="main")
        # print 'Unrecognized command.'