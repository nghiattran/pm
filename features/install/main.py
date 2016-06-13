import argparse

__help__ = "download"

def main():
    print "hi"
    parser = argparse.ArgumentParser(prog="download",
                                 usage="%(prog)s [options] [paths...]\n",
                                 add_help=False)
    main = parser.add_argument_group("Main")

    main.add_argument('move', choices=['rock', 'paper', 'scissors'])

    args = parser.parse_args()

if __name__ == '__main__':
    main()