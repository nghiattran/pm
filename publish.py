from constants import *
from os import path
from utils import is_file_extension


def publish():
    # Generate command list
    commands = [f for f in listdir(COMMAND_DIR) if not path.isfile(path.join(
            COMMAND_DIR, f))]


    command_file = open(path.join(COOLBEE_PATH, 'list', 'command_list'), "w")
    command_file.write('\n'.join(commands))
    command_file.close()

    # Generate engine list
    languages = []
    for file in listdir(LANGUAGE_DIR):
            if path.isfile(path.join(LANGUAGE_DIR, file)) \
                    and file != '__init__.py' \
                    and not is_file_extension(file, extensions = IGNORED_EXTENSIONS):
                name, extesion = path.splitext(file)
                languages.append(name)

    language_file = open(path.join(COOLBEE_PATH, 'list', 'language_list'), "w")
    language_file.write('\n'.join(commands))
    language_file.close()


    # Generate language list
    engines = []
    for file in listdir(ENGINE_DIR):
        if path.isfile(path.join(ENGINE_DIR, file)) \
                and file != '__init__.py' \
                and not is_file_extension(file, extensions = IGNORED_EXTENSIONS):
            name, extesion = path.splitext(file)
            engines.append(name)

    engine_file = open(path.join(COOLBEE_PATH, 'list', 'engine_list'), "w")
    engine_file.write('\n'.join(commands))
    engine_file.close()

if __name__ == '__main__':
    publish()