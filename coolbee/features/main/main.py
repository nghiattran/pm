import argparse, os, sys
import importlib
import imp
from os import path
from utils.main import get_features
from utils.constants import FEATURE_DIR

__help__ = "main"

def main(argv = ['-h']):

    parser = argparse.ArgumentParser(description='Coolbee command line',
                                     add_help=False)

    main = parser.add_argument_group("Main commands")

    for feature in get_features():
        # Exclude main
        if feature != "main":
            module_name = "features.{0}.main".format(feature)
            module = importlib.import_module(module_name)
            main.add_argument(feature, help=module.__help__)

    if len(argv) == 1:
        parser.print_help()
    else:
        args =  main.parse_args(argv)

main()