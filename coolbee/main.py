from sys import argv
from utils.main import get_features, get_strategies
from strategies.python import Python

print get_strategies()

if __name__ == '__main__':
    # Pop file name
    argv.pop(0)

    # If no command specified, exec help for main
    if len(argv) == 0:
        Python().execute(args=argv)

    features = get_features()

    # Get the command
    command = argv[0]

    if command in features:
        argv.pop(0)
        Python().execute(args=argv, command=command)
    else:
        Python().execute(args=argv)


