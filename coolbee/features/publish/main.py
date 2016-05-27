import argparse
import getpass
import tarfile
import semver
from os import path
from sys import argv, stderr
from utils.constants import *
import utils.main as utils
from errors import CleanDirError
from pygit2 import Repository, UserPass, RemoteCallbacks

def main():
    parser = argparse.ArgumentParser(prog='publish',
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
    json = utils.read_json(USER_APP_JSON)

    # check if valid version
    try:
        semver.parse(json['version'])
    except ValueError:
        print 'Error: "{0}" is an invalid version, checkout ' \
              'http://semver.org/ for more detail'.format(json['version'])
        exit(1)

    return json

def process(package_info):

    try:
        repo = Repository(USER_GIT_FOLDER)
    except:
        stderr.write('corrupt')
        exit(1)

    try:
        utils.commit(repo, package_info['version'])
    except CleanDirError:
        stderr.write('Failed to publish, directory clean\n')
        exit(1)


    # name = '{0}@{1}-{2}'.format(package_info['author']['name'].lower(),
    #                            package_info['name'].lower(),
    #                            package_info['version'])
    # with tarfile.open('{0}.tar'.format(name), 'w') as archive:
    #     repo.write_archive(archive=archive, treeish=repo.head.target)
    #


    # Login to get credentials
    username, password = utils.login()

    # Git push using username and password
    remote = repo.remotes[APP_REMOTE['name']]
    credentials = UserPass(username, password)
    callbacks = RemoteCallbacks(credentials=credentials)
    remote.push([APP_GIT_REF], callbacks)

    # Create a tag
    utils.create_tag(repo, package_info['version'])


def postprocess():
    print 'Package has been published'

if __name__ == '__main__':
    main()