import shutil
import tarfile
import urllib2

import sys

import math

import os
import requests
from clint.textui import progress
from coolbee.constants import APP_CACHE_DIR, APP_REMOTE, APP_ARCHIVE_DIR, \
    USER_PACKAGE_FOLDER, USER_CURRENT_DIR, APP_GIT_FOLDER_NAME
from coolbee.languages.python import Python
from coolbee.semver_adapter import max_satisfy
from os import path

from coolbee import utils
from coolbee.engines import BaseEngine
from pygit2 import Repository, clone_repository, init_repository


class Node(BaseEngine):
    engine_name = 'node'
    __package_url = 'http://registry.npmjs.org'
    __json_file_name = 'package.json'

    def __init__(self):
        pass


    def get_download_url(self, name, version):
        return '{0}/{1}/-/{1}-{2}.tgz'.format(self.__package_url, name, version)

    # Installation
    def install(self, args = []):
        package_json, package_list = self.install_preprocess()

        self.install_process(package_json, package_list)

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
        package_list = []

        while len(unsolved_list) != 0:
            name, expression = unsolved_list.pop()
            r = requests.get('{0}/{1}'.format(self.__package_url, name))
            versions_list = r.json()['versions'].keys()
            package_list.append((name, versions_list))

        return package_json, package_list


    def install_process(self, package_json, package_list):
        self.install_process_cached(package_json, package_list)


    def install_postprocess(self):
        pass

    def install_process_cached(self, package_json, package_list):
        tmp_user_path = ''
        for pkgname, versions in package_list:
            tmp_package_path = path.join(USER_CURRENT_DIR, pkgname)
            try:
                os.makedirs(tmp_package_path)
            except OSError:
                pass

            # init repo
            Python().execute_command(command='init', args=['-p', pkgname, '-i'])
            repo = Repository(path.join(tmp_package_path, APP_GIT_FOLDER_NAME))

            print path.join(tmp_package_path, APP_GIT_FOLDER_NAME)
            self.clean(tmp_package_path)

            for version in versions:
                # download
                url = self.get_download_url(name=pkgname, version=version)
                # filename = url.split('/')[-1]
                filename = '{0}@{1}.tgz'.format(pkgname, version)
                # dest = path.join(APP_ARCHIVE_DIR, self.engine_name,filename)
                dest= path.join(USER_CURRENT_DIR,filename)

                # Check package archived is downloaded
                if (path.isfile(dest)):
                    print 'Locate {0}'.format(filename)
                else:
                    print 'Download {0}'.format(filename)
                    self.download(url=url, dest=dest)

                # Extract file
                name, extension = path.splitext(filename)
                path_to_package = path.join(USER_CURRENT_DIR, name)
                tar = tarfile.open(dest)
                tar.extractall(path=path_to_package)
                tar.close()

                tmp_path = path.join(path.join(path_to_package, 'package'))
                files = os.listdir(tmp_path)
                for f in os.listdir(tmp_path):
                    shutil.move(path.join(tmp_path, f), tmp_package_path)


                # break
                utils.commit(repo, pathset=[tmp_package_path], message=version)
                # try:
                #     utils.commit(repo, pathset=[tmp_package_path])
                # except Exception as e:
                #     print e.message

                self.clean(tmp_package_path)
                break

    def clean(self, path, ignores=[APP_GIT_FOLDER_NAME]):

        for f in os.listdir(path):
            filepath = os.path.join(path, f)
            if os.path.isdir(filepath) and f in ignores:
                continue
            else:
                os.remove(filepath)

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