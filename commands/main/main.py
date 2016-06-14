import argparse
from sys import argv

from utils import get_features
from constants import COMMAND_DIR
from os import path

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
            link = path.join(COMMAND_DIR, feature, "description")

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
