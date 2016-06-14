#!/usr/bin/python3

from sys import argv

import os
from constants import MAIN_FILE_NAME, COMMAND_DIR
from languages.python import Python
from utils import get_features, get_languages, get_language


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
        exit()

    features = get_features()

    # Get the command
    command = argv[0]

    if command in features:
        argv.pop(0)

        # Main file for a command
        filename = get_main_file(os.path.join(COMMAND_DIR, command))

        languages = get_languages()

        # Find out what language the file is written and execute the file
        for language in languages:
            language_instance = get_language(language)()
            if language_instance.is_language(filename):
                language_instance.execute_command(args=argv, command=command)
    else:
        Python().execute_command(command="main")