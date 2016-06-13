import argparse
from sys import argv
import os, importlib
from os import path
import features.download
from subprocess import call
from constants import BASE_PYTHON_PATH, FEATURE_DIR, MAIN_FILE_PYTHON_NAME, \
    USER_CURRENT_DIR
from utils import get_features

# Exec python files
def exec_python(args, command="main"):
    command = os.path.join(BASE_PYTHON_PATH, FEATURE_DIR, command,
                           MAIN_FILE_PYTHON_NAME)
    default = ["python2", command]
    default.extend(args)
    # print default
    call(default)
    exit()

if __name__ == '__main__':

    # Pop file name
    argv.pop(0)

    # If no command specified, exec help for main
    if len(argv) == 0:
        exec_python(args=argv)

    features = get_features()

    # Get the command
    command = argv[0]

    if command in features:
        argv.pop(0)
        exec_python(args=argv, command=command)
    else:
        exec_python(args=argv)


