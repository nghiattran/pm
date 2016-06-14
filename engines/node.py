import shutil
import tarfile
import urllib2

import sys

import math

import os
import requests
from clint.textui import progress
from constants import APP_CACHE_DIR, APP_REMOTE, APP_ARCHIVE_DIR, \
    USER_PACKAGE_FOLDER, USER_CURRENT_DIR, APP_GIT_FOLDER_NAME
from languages.python import Python
from os import path

import utils
from engines import BaseEngine
from pygit2 import Repository, clone_repository, init_repository


class Node(BaseEngine):
    engine_name = 'node'
    __package_url = 'http://registry.npmjs.org'
    __json_file_name = 'git.json'
    _file_extension = "tgz"
    _package_folder = 'node_modules'
    _tmp_package_folder = 'package'

    def __init__(self):
        pass


    def get_download_url(self, name, version):
        return '{0}/{1}/-/{1}-{2}.tgz'.format(self.__package_url, name, version)

    # Installation
    def install(self, args = []):
        package_json, dependencies = self.install_preprocess()

        self.install_process(package_json, dependencies)

        # self.install_postprocess()

    def install_preprocess(self):
        # Read package.json
        try:
            package_json = utils.read_package_json(filename=self.__json_file_name)
        except IOError as e:
            print e.message
            print 'Error: This is not a {0} package.'.format(self.engine_name)
            exit(1)

        unsolved_list = package_json['dependencies'].items()
        dependencies = []

        # Get infomation of all dependencies
        print "Gathering dependencies infomation"
        while len(unsolved_list) != 0:
            name, expression = unsolved_list.pop()
            r = requests.get('{0}/{1}'.format(self.__package_url, name))
            versions_list = r.json()['versions'].keys()
            dependencies.append((name, versions_list))
        print "Done gathering dependencies infomation"

        return package_json, dependencies


    def install_process(self, package_json, package_list):
        self.install_process_cached(package_json, package_list)


    def install_postprocess(self):
        pass

    def install_process_cached(self, package_json, dependencies):
        tmp_user_path = ''
        for pkgname, versions in dependencies:
            package_cache_path = path.join(APP_CACHE_DIR, pkgname)
            git_package_cache_path = path.join(package_cache_path, APP_GIT_FOLDER_NAME)
            try:
                os.makedirs(package_cache_path)
            except OSError:
                pass

            # init repo
            if not path.isdir(git_package_cache_path):
                Python().execute_command(command='init', args=['-p', package_cache_path, '-i'])
            repo = Repository(git_package_cache_path)

            # TODO: Should check cached versions
            self.clean(package_cache_path)

            # clean up all version but the last one
            for version in versions[:-1]:
                self.install_package(repo, pkgname, version, package_cache_path)
                self.clean(package_cache_path)

            self.install_package(repo, pkgname, versions[-1], package_cache_path)

    def install_package(self, repo, pkgname, version, package_cache_path):
        local_packages_path = path.join(path.join(USER_CURRENT_DIR, self._package_folder))

        # download
        url = self.get_download_url(name=pkgname, version=version)
        # filename = url.split('/')[-1]
        filename = '{0}@{1}.{2}'.format(pkgname, version, self._file_extension)
        # dest = path.join(APP_ARCHIVE_DIR, self.engine_name,filename)
        dest = path.join(APP_ARCHIVE_DIR, pkgname, version + ".tgz")

        # Check package archived is downloaded
        if (path.isfile(dest)):
            print 'Locate {0}'.format(filename)
        else:
            print 'Download {0}'.format(filename)
            self.download(url=url, dest=dest)

        # Extract file
        path_to_package = path.join(local_packages_path, pkgname)
        tar = tarfile.open(dest)
        tar.extractall(path=path_to_package)
        tar.close()

        # tmp_package_path = path.join(path_to_package, self._tmp_package_folder)
        # for f in os.listdir(tmp_package_path):
        #     shutil.move(path.join(tmp_package_path, f), path_to_package)

        tmp_package_path = path.join(path_to_package, self._tmp_package_folder)
        for f in os.listdir(tmp_package_path):
            shutil.move(path.join(tmp_package_path, f), path.join(package_cache_path, f))

        # utils.commit(repo, pathset=[tmp_package_path], message=version)
        # break
        try:
            utils.commit(repo, pathset=[tmp_package_path], message=version)
        except Exception as e:
            print e
            print e.message


    def clean(self, path, ignores=[APP_GIT_FOLDER_NAME]):
        for f in os.listdir(path):
            filepath = os.path.join(path, f)
            if os.path.isdir(filepath) and f in ignores:
                continue
            elif not os.path.isdir(filepath):
                os.remove(filepath)
            else:
                shutil.rmtree(filepath)

    # Unused for now
    def install_package_cached(self, pkg_name, expression):
        pass

    def download(self, url = None, dest = None):
        if url is None:
            print "Error: Missing url."
            return

        if dest is None:
            dest = url.split('/')[-1]
        else:
            try:
                os.makedirs(path.dirname(dest))
            except OSError:
                pass

        print "here"
        f = open(dest, 'wb')
        u = urllib2.urlopen(url)
        meta = u.info()

        total_length = float(meta.getheaders("Content-Length")[0])
        chunk = 8000
        if total_length / 100 < chunk:
            chunk = int(total_length / 100)

        toolbar_width = int(math.ceil(total_length/chunk))
        count = 0

        with progress.Bar(expected_size=toolbar_width) as bar:
            while True:
                buffer = u.read(chunk)
                if not buffer:
                    break
                count+=1
                bar.show(count)
                # Write to file
                f.write(buffer)
        f.close()


    def publish(self):
        pass