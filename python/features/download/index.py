import argparse


def main():
    parser = argparse.ArgumentParser(prog="download",
                                 usage="%(prog)s [options] [paths...]\n",
                                 add_help=False)
    main = parser.add_argument_group("Main")

    main.add_argument('move', choices=['rock', 'paper', 'scissors'])

    args = parser.parse_args()
