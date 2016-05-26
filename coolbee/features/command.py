
class BaseCommand:
    __command__ = None
    __help__ = None

    def __init__(self, command, help):
        self.__command__ = command
        self.__help__ = help

    def postProcess(self):
        raise NotImplementedError( "Should have implemented this" )

    def process(self):
        raise NotImplementedError( "Should have implemented this" )

    def preProcess(self):
        raise NotImplementedError( "Should have implemented this" )