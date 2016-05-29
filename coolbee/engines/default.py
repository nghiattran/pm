import tarfile

from coolbee.engines import BaseEngine
from coolbee.semver_adapter import max_satisfy
from os import path
from pygit2 import Repository, clone_repository
from coolbee.constants import *
import coolbee.utils as utils

class Default(BaseEngine):

    def __init__(self):
        pass

    # Installation
    def install(self, args = []):
        package_json = self.install_preprocess()

        self.install_process(package_json)

        self.install_postprocess()

    def install_preprocess(self):
        package_json = utils.read_package_json()
        return package_json

    def install_process(self, package_json):
        self.install_process_cached(package_json)


    def install_postprocess(self):
        pass

    def install_process_cached(self, package_json):
        self.install_package('sample', '0.0.10')


    def install_package(self, pkg_name, expression):
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


    def publish(self):
        pass