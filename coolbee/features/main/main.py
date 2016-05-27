import argparse, os, sys
import importlib
import imp
from sys import argv
from os import path
from utils.main import get_features
from utils.constants import FEATURE_DIR

__help__ = "main"

def main():
    parser = argparse.ArgumentParser(description='Coolbee command line',
                                     prog="coolbee",
                                     usage="%(prog)s [command]\n",
                                     add_help=False)

    main = parser.add_argument_group("commands")

    for feature in get_features():
        # Exclude main
        if feature != "main":
            link = path.join(FEATURE_DIR, feature, "description")

            try:
                help = open(link).read()
            except:
                help = ""

            main.add_argument(feature, help=help)

    if len(argv) == 1:
        parser.print_help()
    else:
        args =  parser.parse_args(argv)

main()
