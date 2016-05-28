import os
from os import path, listdir

APP_NAME = 'git'
APP_GIT_FOLDER = '.' + APP_NAME
APP_JSON = APP_NAME + '.json'
APP_REMOTE = {
    'name': 'origin',
    'url': 'https://github.com/nghiattran/coolbee-test.git'
}
APP_GIT_BRANCH = 'master'
APP_GIT_REF = 'refs/heads/{0}'.format(APP_GIT_BRANCH)
APP_LOCAL_DIR_NAME = '{0}_packages'.format(APP_NAME)
APP_GlObAL_DIR_NAME = '.{0}'.format(APP_LOCAL_DIR_NAME)

MAIN_FILE_NAME = 'main'
MAIN_FILE_PYTHON_NAME = MAIN_FILE_NAME + '.py'

USER_CURRENT_DIR = os.getcwd()
USER_GIT_FOLDER = path.join(USER_CURRENT_DIR, APP_GIT_FOLDER)
USER_APP_JSON = path.join(USER_CURRENT_DIR, APP_JSON)
USER = {
    'email': 'nghiattran3@gmail.com',
    'password': 'password',
    'name': 'nghiattran'
}

COOLBEE_PATH = path.dirname(path.realpath(__file__))
COOLBEE_BASE_PATH = path.dirname(COOLBEE_PATH)

FEATURE_DIR_NAME = 'features'
FEATURE_DIR = path.join(COOLBEE_PATH, FEATURE_DIR_NAME)
LANGUAGE_DIR_NAME = 'languages'
LANGUAGE_DIR = path.join(COOLBEE_PATH, LANGUAGE_DIR_NAME)
PYTHON_COMMAND = 'python2'
IGNORED_EXTENSIONS = ['pyc']
