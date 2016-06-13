import argparse, os
from sys import argv
from os import listdir
from os.path import isfile, join
from coolbee.utils import get_features

def main(argv = ['-h']):

    # parser.add_argument('bar')
    # parser.add_argument('move', choices=['rock', 'paper', 'scissors'])
    parser = argparse.ArgumentParser(description='Process some integers.')
    # parser.add_argument('integers', metavar='N', type=int, nargs='+',
    #                     help='an integer for the accumulator')
    # parser.add_argument('--sum', dest='accumulate', action='store_const',
    #                     const=sum, default=max,
    #                     help='sum the integers (default: find the max)')
    # parser.add_argument('move', choices=['rock', 'paper', 'scissors'])
    #
    main = parser.add_argument_group("Main")

    for feature in utils.get_features():
        main.add_argument(feature, help='bar help')

    if len(argv) == 1:
        parser.print_help()
    else:
        # parser.parse_args(['rock', 'paper'])
        args =  parser.parse_args(argv)
        print args.move
        # print(args.accumulate(args.integers))

main()