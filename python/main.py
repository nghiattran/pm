import argparse
from sys import argv
import os, importlib
from os import path
import features.download
from subprocess import call

FEATURE_DIR = "features"


def exec_python(args, command="main"):
    current_path = os.getcwd()
    command = os.path.join(current_path, FEATURE_DIR, command, "index.py")
    default = ["python2", command]
    default.extend(args)
    print default
    call(default)

if __name__ == '__main__':
    current_path = path.dirname(os.path.realpath(__file__))
    feature_path = path.join(current_path, FEATURE_DIR)
    features = [f for f in os.listdir(feature_path) if not path.isfile(path.join(
        feature_path, f))]

    # Pop file name
    argv.pop(0)

    # Get the command
    command = argv[0]

    if command in features:
        argv.pop(0)
        exec_python(args=argv, file=command)
    else:
        exec_python(args=argv)


