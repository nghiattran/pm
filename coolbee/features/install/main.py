import argparse
import tarfile

import coolbee.utils as utils
from coolbee.constants import *
from os import path
from pygit2 import clone_repository, Repository, GIT_SORT_TIME, GIT_SORT_TOPOLOGICAL

__help__ = "download"

def main():
    parser = argparse.ArgumentParser(prog="download",
                                 usage="%(prog)s [options] [paths...]\n",
                                 add_help=False)
    main = parser.add_argument_group("Main")

    # main.add_argument('move', choices=['rock', 'paper', 'scissors'])

    args = parser.parse_args()

    install()

def install():
    preprocess()

    process()

    postprocess()

def preprocess():
    # utils.verify_package()
    #
    # json = utils.read_package_json()
    pass

def process():
    tmp_path = path.join(USER_CURRENT_DIR, 'temp')
    # if path.isdir(tmp_path):
    #     print 'yeah'
    # clone_repository(APP_REMOTE['url'], tmp_path)
    repo = Repository(tmp_path)

    # Get all commit
    # Note a commit = a version
    commits = utils.get_commits(repo)

    # Create tar file of specified version
    version = '0.0.1'
    with tarfile.open('{0}.tar'.format(version), 'w') as archive:
        repo.write_archive(archive=archive, treeish=commits[version].tree_id)

def postprocess():
    pass

if __name__ == '__main__':
    main()

