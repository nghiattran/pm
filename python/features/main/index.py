import argparse, os
from sys import argv
from os import listdir
from os.path import isfile, join

# def main(argv = ['-h']):

# parser.add_argument('bar')
# parser.add_argument('move', choices=['rock', 'paper', 'scissors'])
parser = argparse.ArgumentParser(description='Process some integers.')
# parser.add_argument('integers', metavar='N', type=int, nargs='+',
#                     help='an integer for the accumulator')
# parser.add_argument('--sum', dest='accumulate', action='store_const',
#                     const=sum, default=max,
#                     help='sum the integers (default: find the max)')
# parser.add_argument('move', choices=['rock', 'paper', 'scissors'])

if len(argv) == 0:
    parser.print_help()
else:
    # parser.parse_args(['rock', 'paper'])
    args =  parser.parse_args(argv)
    print args.move
    # print(args.accumulate(args.integers))