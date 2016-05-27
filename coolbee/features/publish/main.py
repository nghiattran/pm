import argparse
import getpass
import tarfile

from os import path
from sys import argv, stderr
from utils.constants import *
import utils.main as utils
from pygit2 import Repository, Signature, UserPass, RemoteCallbacks

def main():
    parser = argparse.ArgumentParser(prog='public',
                                 usage='%(prog)s [options] [paths...]\n',
                                 add_help=True)

    args = parser.parse_args()
    publish()

def publish():
    # preprocess
    package_info = preprocess()

    # process
    process(package_info)

    # postprocess
    postprocess()

def preprocess():
    # check if the directory is init yet
    # if yes, go on
    # if no, exit
    if not path.isdir(path.join(USER_CURRENT_DIR, APP_GIT_FOLDER)):
        stderr.write('Error: This is not a {0} package.\n'.format(APP_NAME))
        exit(1)

    # check if APP_JSON exists
    # if yes, go on
    # if no, exit
    if not path.isfile(path.join(USER_CURRENT_DIR, APP_JSON)):
        stderr.write('Error: Missing {0} file.\n'.format(APP_JSON))
        exit(1)

    # read json file
    return utils.read_json(USER_APP_JSON)

def process(package_info):
    try:
        repo = Repository(USER_GIT_FOLDER)
        # for commit in repo.walk(repo.head.target):
        #     print commit.message
    except:
        stderr.write('corrupt')
        exit(1)

    # utils.commit(repo, package_info['version'])

    # name = '{0}@{1}-{2}'.format(package_info['author']['name'].lower(),
    #                            package_info['name'].lower(),
    #                            package_info['version'])
    # with tarfile.open('{0}.tar'.format(name), 'w') as archive:
    #     repo.write_archive(archive=archive, treeish=repo.head.target)
    #
    # for commit in repo.walk(repo.head.target):
    #     print commit.message

    # Login to get credentials
    username, password = utils.login()

    # Git push using username and password
    remote = repo.remotes[APP_REMOTE['name']]
    credentials = UserPass(username, password)
    callbacks = RemoteCallbacks(credentials=credentials)
    remote.push([APP_GIT_BRANCH], callbacks)


def postprocess():
    pass

if __name__ == '__main__':
    main()