import argparse, os
from sys import argv, stderr
from os import path
import utils.main as utils
from utils.constants import USER_CURRENT_DIR, APP_GIT_FOLDER, \
    USER_CURRENT_DIR, APP_JSON, USER_GIT_FOLDER, APP_GIT_BRANCH
from pygit2 import init_repository, Repository, Diff, Signature
import json
import shutil

info = {}

def main():
    parser = argparse.ArgumentParser(prog='init',
                                 usage='%(prog)s [options] [paths...]\n',
                                 add_help=True)

    args = parser.parse_args()
    # print args
    init_project()


def init_project():
    # preprocess
    preprocess()

    # process
    process()

    # postprocess
    postprocess()
    print 'Initialized Coolbee for {0}.'.format(path.basename(USER_CURRENT_DIR))

def preprocess():
    # check if the directory is init yet
    # if yes, exit
    # if no, go on
    if path.isdir(path.join(USER_CURRENT_DIR, APP_GIT_FOLDER)):
        stderr.write('Error: Package has been initialized\n')
        exit(1)


def postprocess():
    # print out notification
    pass

def process():
    # init git
    repo = init_repository(USER_GIT_FOLDER)
    # print USER_GIT_FOLDER
    # repo = Repository(USER_GIT_FOLDER)
    # move .git to .coolbee
    tmp_path = path.join(USER_GIT_FOLDER, '.git')
    try:
        files = os.listdir(tmp_path)
        for f in files:
            shutil.move(path.join(tmp_path, f), USER_GIT_FOLDER)
    except:
        pass
    finally:
        repo = Repository(USER_GIT_FOLDER)

    # add hidden files to info/exclude
    f = open(path.join(USER_GIT_FOLDER, 'info', 'exclude'), 'a')
    f.write('\n' + APP_GIT_FOLDER)
    f.close()

    # create first commit
    utils.commit(repo)

    # add json file
    with open(path.join(USER_CURRENT_DIR, APP_JSON), 'w') as outfile:
        json.dump(info, outfile)



if __name__ == '__main__':
    main()