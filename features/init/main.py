# from __future__ import absolute_import
import argparse, os
from sys import argv, stderr
from os import listdir
from os.path import isfile, join
# from python.constants import USER_CURRENT_DIR, APP_GIT_FOLDER
from ...constants import USER_CURRENT_DIR, APP_GIT_FOLDER


def main():
    parser = argparse.ArgumentParser(prog="init",
                                 usage="%(prog)s [options] [paths...]\n",
                                 add_help=False)
    main = parser.add_argument_group("Main")
    main.add_argument('move', choices=['rock', 'paper', 'scissors'])
    args = parser.parse_args()


def init_project():
    # preprocess
    preprocess()

    # process
    process()

    # postprocess
    postprocess()

    print "helllo"

def preprocess():
    # check if the directory is init yet
    # if yes, exit
    # if no, go on
    if os.path.isfile(os.path.join(USER_CURRENT_DIR, APP_GIT_FOLDER)):
        stderr.write("Package has been initialized\n")
        exit(1)

    print "helllo"

def postprocess():
    # print out notification
    print "helllo"

def process():
    # init git

    # add hidden files to info/exclude

    # add json file ???


    print "helllo"


main()
