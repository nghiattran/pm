import argparse
from os import path
from sys import argv, stderr
from utils.constants import *
import utils.main as utils
from pygit2 import Repository, Signature

def main():
    parser = argparse.ArgumentParser(prog='public',
                                 usage='%(prog)s [options] [paths...]\n',
                                 add_help=True)

    args = parser.parse_args()
    publish()

def publish():
    # preprocess
    preprocess()

    # process
    process()

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

def process():
    print USER_GIT_FOLDER
    try:
        repo = Repository(USER_GIT_FOLDER)
        print repo.listall_branches()
        for commit in repo.walk(repo.head.target):
            print commit.message
        # exit(1)
    except:
        stderr.write('corrupt')
        exit(1)

    utils.commit(repo, 'changed')


def postprocess():
    pass

if __name__ == '__main__':
    main()