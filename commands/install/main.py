import argparse

import utils as utils

__help__ = "download"

def main():
    parser = argparse.ArgumentParser(prog="download",
                                 usage="%(prog)s [options] [paths...]\n",
                                 add_help=True)
    main = parser.add_argument_group("Main")
    main.add_argument('--cache', help='Cache package', dest='cache',
                      action='store_true')
    parser.add_argument('--engine', '-e', help='foo help', dest='engine',
                        default='default')


    args = parser.parse_args()

    if args.engine in utils.get_engines():
        utils.get_engine(args.engine)().install(args)
    else:
        print 'Error: unsupported engine.'

if __name__ == '__main__':
    main()

