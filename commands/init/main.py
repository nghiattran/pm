import argparse
import json
import shutil
from sys import stderr
import utils as utils
import os
from constants import USER_CURRENT_DIR, APP_GIT_FOLDER_NAME, APP_REMOTE, \
    APP_NAME, APP_JSON
from os import path
from pygit2 import init_repository, Repository

info = {}

def main():
    parser = argparse.ArgumentParser(prog='init',
                                 usage='%(prog)s [options] [paths...]\n',
                                 add_help=True)

    parser.add_argument('--path', '-p', help='Path to package')
    parser.add_argument('--ignore', '-i', help='Path to package', dest='ignore',
                      action='store_true')

    args = parser.parse_args()

    init_project(args)


def init_project(args):
    # preprocess
    preprocess(args)

    # process
    process(args)

    # postprocess
    postprocess(args)

def preprocess(args):
    if args.path:
        args.path = path.abspath(args.path)
    else:
        args.path = USER_CURRENT_DIR

    # check if the directory is init yet
    # if yes, exit
    # if no, go on
    if path.isdir(path.join(args.path, APP_GIT_FOLDER_NAME)):
        stderr.write('Error: Package has been initialized\n')
        exit(1)


def postprocess(args):
    print 'Initialized {0} for {1}.'.format(APP_NAME.capitalize(), path.basename(
        args.path))

def process(args):
    USER_GIT_FOLDER = path.join(args.path, APP_GIT_FOLDER_NAME)

    # add json file
    if not args.ignore:
        path_to_json = path.join(args.path, APP_JSON)
        if not path.isfile(path_to_json):
            info = utils.ask_package_info()
            with open(path_to_json, 'w') as outfile:
                outfile.write(json.dumps(info, indent=4, sort_keys=True))
                # json.dump(info, outfile)

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
    f.write('\n' + APP_GIT_FOLDER_NAME)
    f.close()

    # create first commit
    utils.commit(repo, init=True)


    # add a remote
    try:
        remote = repo.remotes[APP_REMOTE['name']]
    except:
        remote = repo.remotes.create(APP_REMOTE['name'], APP_REMOTE['url'])
        repo.remotes.set_push_url(APP_REMOTE['name'], remote.url)


if __name__ == '__main__':
    main()