import argparse
import tarfile

import coolbee.utils as utils
from coolbee.constants import *
from os import path
from pygit2 import clone_repository, Repository, GIT_SORT_TIME, GIT_SORT_TOPOLOGICAL
from coolbee.semver_adapter import parse, max_satisfy

__help__ = "download"

def main():
    parser = argparse.ArgumentParser(prog="download",
                                 usage="%(prog)s [options] [paths...]\n",
                                 add_help=True)
    main = parser.add_argument_group("Main")
    main.add_argument('--cache', help='Cache package', dest='cache',
                      action='store_true')
    # main.add_argument('move', choices=['rock', 'paper', 'scissors'])

    args = parser.parse_args()

    install(args)

def install(args):
    preprocess()

    process()

    postprocess()

def preprocess():
    # utils.verify_package()
    #
    # json = utils.read_package_json()
    pass


def process():
    # tmp_path = path.join(USER_CURRENT_DIR, 'temp')
    process_cached()


def postprocess():
    pass


def process_cached():
    # tmp_path = path.join(APP_CACHE_DIR, 'temp')
    install_package('sample', '0.0.10')


def install_package(pkg_name, expression):
    package_cache_path = path.join(APP_CACHE_DIR, pkg_name)

    # Check if the package is cached
    try:
        repo = Repository(package_cache_path)

        # TODO: check lastest version
        # If lastest is cached, advance
        # If no, prompt user
    except KeyError as e:
        repo = clone_repository(APP_REMOTE['url'], package_cache_path)

    # Get suitable version for the expression
    versions = utils.get_versions_cached(repo)
    version = max_satisfy(versions=versions.keys(), expression='')

    package_archive_name = '{0}-{1}.tar'.format(pkg_name, version)
    package_archive_path = path.join(APP_ARCHIVE_DIR, package_archive_name)

    # Create archive file
    # If the file already exists, move forward
    if path.isfile(package_archive_path):
        with tarfile.open(package_archive_path, 'w') as archive:
            repo.write_archive(archive=archive, treeish=versions[version].tree_id)

    # TODO: use strategy
    # Extract archive to package dir
    path_to_package = path.join(USER_PACKAGE_FOLDER, 'user', pkg_name)
    tar = tarfile.open(package_archive_path)
    tar.extractall(path=path_to_package)
    tar.close()


if __name__ == '__main__':
    main()

