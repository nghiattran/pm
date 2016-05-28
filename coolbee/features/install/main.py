import argparse

from coolbee import utils

__help__ = "download"

def main():
    print "hi"
    parser = argparse.ArgumentParser(prog="download",
                                 usage="%(prog)s [options] [paths...]\n",
                                 add_help=False)
    main = parser.add_argument_group("Main")

    main.add_argument('move', choices=['rock', 'paper', 'scissors'])

    args = parser.parse_args()

    install()

def install():
    preprocess()

    process()

    postprocess()

def preprocess():

    json = utils.read_package_json()

def process():
    pass

def postprocess():
    pass

if __name__ == '__main__':
    main()

