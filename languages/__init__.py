from abc import ABCMeta, abstractmethod
from os import path
from utils import is_file_extension

class BaseStrategy(object):
    __metaclass__ = ABCMeta
    __extensions = []
    __language = ""

    # extensions: an array of all file extensions
    # language: languege name
    def __init__(self, extensions, language):
        self.__extensions = extensions
        self.__language = language

    @abstractmethod
    def execute(self):
        pass

    def is_language(self, filename):
        return is_file_extension(filename, self.__extensions)

    def get_name(self):
        return self.__language

    def get_extensions(self):
        return self.__extensions