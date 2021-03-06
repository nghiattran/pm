import os
from os import path, listdir

APP_IP=""
APP_PACKAGE_GIT_NAME = "nghia@192.168.1.51:clones/first"
APP_NAME = 'git'
APP_GIT_FOLDER_NAME = '.' + APP_NAME
APP_JSON = APP_NAME + '.json'
APP_REMOTE = {
    'name': 'origin',
    'url': 'https://github.com/nghiattran/coolbee-test.git'
}
APP_GIT_BRANCH = 'master'
APP_GIT_REF = 'refs/heads/{0}'.format(APP_GIT_BRANCH)
APP_LOCAL_DIR_NAME = '{0}_packages'.format(APP_NAME)
APP_GlObAL_DIR_NAME = '.{0}'.format(APP_LOCAL_DIR_NAME)
APP_GlObAL_DIR = path.join(os.environ['HOME'], APP_GlObAL_DIR_NAME)

APP_CACHE_DIR_NAME = 'cache'
APP_CACHE_DIR = path.join(APP_GlObAL_DIR, APP_CACHE_DIR_NAME)
APP_ARCHIVE_DIR_NAME = 'archive'
APP_ARCHIVE_DIR = path.join(APP_GlObAL_DIR, APP_ARCHIVE_DIR_NAME)

MAIN_FILE_NAME = 'main'
MAIN_FILE_PYTHON_NAME = MAIN_FILE_NAME + '.py'

USER_CURRENT_DIR = os.getcwd()
USER_GIT_FOLDER = path.join(USER_CURRENT_DIR, APP_GIT_FOLDER_NAME)
USER_APP_JSON = path.join(USER_CURRENT_DIR, APP_JSON)
USER_PACKAGE_FOLDER = path.join(USER_CURRENT_DIR, APP_LOCAL_DIR_NAME)
USER = {
    'email': 'nghiattran3@gmail.com',
    'password': 'password',
    'name': 'nghiattran'
}

COOLBEE_PATH = path.dirname(path.realpath(__file__))
COOLBEE_BASE_PATH = path.dirname(COOLBEE_PATH)

COMMAND_DIR_NAME = 'commands'
COMMAND_DIR = path.join(COOLBEE_PATH, COMMAND_DIR_NAME)
LANGUAGE_DIR_NAME = 'languages'
LANGUAGE_DIR = path.join(COOLBEE_PATH, LANGUAGE_DIR_NAME)
ENGINE_DIR_NAME = 'engines'
ENGINE_DIR = path.join(COOLBEE_PATH, ENGINE_DIR_NAME)
PYTHON_COMMAND = 'python2'
IGNORED_EXTENSIONS = ['pyc']
