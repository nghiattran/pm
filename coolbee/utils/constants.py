import os
from os import path

APP_NAME = "coolbee"
APP_GIT_FOLDER = "." + APP_NAME
MAIN_FILE_NAME = "main"
MAIN_FILE_PYTHON_NAME = MAIN_FILE_NAME + ".py"
USER_CURRENT_DIR = os.getcwd()
BASE_PYTHON_PATH = path.normpath(path.join(path.dirname(
    path.realpath(__file__)), ".."))
FEATURE_DIR = path.join(BASE_PYTHON_PATH, "features")
STRATEGY_DIR = path.join(BASE_PYTHON_PATH, "strategies")
PYTHON_COMMAND = "python2"
IGNORED_EXTENSIONS = ["pyc"]