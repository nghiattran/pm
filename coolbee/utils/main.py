from os import path,listdir

from constants import BASE_PYTHON_PATH, FEATURE_DIR, STRATEGY_DIR, \
    IGNORED_EXTENSIONS

def get_features():
    return [f for f in listdir(FEATURE_DIR) if not path.isfile(path.join(
        FEATURE_DIR, f))]

def get_strategies():
    strategies = []
    for file in listdir(STRATEGY_DIR):
        if path.isfile(path.join(STRATEGY_DIR, file)) \
                and file != "__init__.py" \
                and not is_file_extension(file, extensions = IGNORED_EXTENSIONS):
            name, extesion = path.splitext(file)
            strategies.append(name)

    return strategies

def is_file_extension(filename, extensions = IGNORED_EXTENSIONS):
    name, extesion = path.splitext(filename)
    if extesion[1:] in extensions:
        return True
    return False
