import argparse
import json
import shutil
from sys import stderr
import coolbee.utils as utils

from coolbee.constants import *
from pygit2 import init_repository, Repository

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

def preprocess():
    # check if the directory is init yet
    # if yes, exit
    # if no, go on
    if path.isdir(path.join(USER_CURRENT_DIR, APP_GIT_FOLDER)):
        stderr.write('Error: Package has been initialized\n')
        exit(1)


def postprocess():
    print 'Initialized {0} for {1}.'.format(APP_NAME.capitalize(), path.basename(
        USER_CURRENT_DIR))

def process():
    # init git
    repo = init_repository(USER_GIT_FOLDER)
    # print USER_GIT_FOLDER
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
    utils.commit(repo, init=True)

    # add json file
    path_to_json = path.join(USER_CURRENT_DIR, APP_JSON)
    if not path.isfile(path_to_json):
        with open(path_to_json, 'w') as outfile:
            json.dump(info, outfile)

    # add a remote
    try:
        remote = repo.remotes[APP_REMOTE['name']]
    except:
        remote = repo.remotes.create(APP_REMOTE['name'], APP_REMOTE['url'])
        repo.remotes.set_push_url(APP_REMOTE['name'], remote.url)


if __name__ == '__main__':
    main()