import os
from os import path

APP_NAME = 'git'
APP_GIT_FOLDER = '.' + APP_NAME
APP_JSON = APP_NAME + '.json'
APP_REMOTE = {
    'name': 'origin',
    'url': 'https://github.com/nghiattran/pm.git'
}
APP_GIT_BRANCH = 'test'
APP_GIT_REF = 'refs/heads/{0}'.format(APP_GIT_BRANCH)

MAIN_FILE_NAME = 'main'
MAIN_FILE_PYTHON_NAME = MAIN_FILE_NAME + '.py'

USER_CURRENT_DIR = os.getcwd()
USER_GIT_FOLDER = path.join(USER_CURRENT_DIR, APP_GIT_FOLDER)
USER_APP_JSON = path.join(USER_CURRENT_DIR, APP_JSON)
USER_EMAIL = 'email@email.com'
USER_PASSWORD = 'password'


COOLBEE_PATH = path.normpath(path.join(path.dirname(
    path.realpath(__file__)), '..'))

FEATURE_DIR_NAME = 'features'
FEATURE_DIR = path.join(COOLBEE_PATH, FEATURE_DIR_NAME)

LANGUAGE_DIR_NAME = 'languages'
LANGUAGE_DIR = path.join(COOLBEE_PATH, LANGUAGE_DIR_NAME)
PYTHON_COMMAND = 'python2'
IGNORED_EXTENSIONS = ['pyc']