import sys
from os import path


class BaseCommand:
    __command__ = None
    __help__ = None

    def __init__(self, command, help):
        self.__command__ = command
        self.__help__ = help
        current_path = path.dirname(path.realpath(__file__))
        __base_path__ = path.normpath(path.join(current_path, '..'))
        sys.path.append(__base_path__)

    def postProcess(self):
        raise NotImplementedError( "Should have implemented this" )

    def process(self):
        raise NotImplementedError( "Should have implemented this" )

    def preProcess(self):
        raise NotImplementedError( "Should have implemented this" )


c = BaseCommand("he", "hi")