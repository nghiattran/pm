from abc import ABCMeta, abstractmethod

class BaseEngine(object):
    __metaclass__ = ABCMeta

    @abstractmethod
    def install(self, args=[]):
        pass

    @abstractmethod
    def publish(self, args=[]):
        pass