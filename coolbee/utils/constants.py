import os
from os import path

APP_NAME = "coolbee"
APP_GIT_FOLDER = "." + APP_NAME
APP_JSON = APP_NAME + ".json"
APP_GIT_BRANCH = "refs/heads/master"

MAIN_FILE_NAME = "main"
MAIN_FILE_PYTHON_NAME = MAIN_FILE_NAME + ".py"

USER_CURRENT_DIR = os.getcwd()
USER_GIT_FOLDER = path.join(USER_CURRENT_DIR, APP_GIT_FOLDER)

COOLBEE_PATH = path.normpath(path.join(path.dirname(
    path.realpath(__file__)), ".."))

FEATURE_DIR_NAME = "features"
FEATURE_DIR = path.join(COOLBEE_PATH, FEATURE_DIR_NAME)

LANGUAGE_DIR_NAME = "languages"
LANGUAGE_DIR = path.join(COOLBEE_PATH, LANGUAGE_DIR_NAME)
PYTHON_COMMAND = "python2"
IGNORED_EXTENSIONS = ["pyc"]