import getpass
import json

from os import path,listdir
import importlib
from constants import *
from pygit2 import Signature

# Get all main commands
def get_features():
    return [f for f in listdir(FEATURE_DIR) if not path.isfile(path.join(
        FEATURE_DIR, f))]

# Get all supported languages
def get_languages():
    strategies = []
    for file in listdir(LANGUAGE_DIR):
        if path.isfile(path.join(LANGUAGE_DIR, file)) \
                and file != '__init__.py' \
                and not is_file_extension(file, extensions = IGNORED_EXTENSIONS):
            name, extesion = path.splitext(file)
            strategies.append(name)
    return strategies


# Get a language object
def get_language(language='python'):
    path= '{0}.{1}'.format(LANGUAGE_DIR_NAME, language)
    module = importlib.import_module(path)
    return getattr(module, language.capitalize())


def is_file_extension(filename, extensions = IGNORED_EXTENSIONS):
    name, extesion = path.splitext(filename)
    if extesion[1:] in extensions:
        return True
    return False


def commit(repo, message='init package'):
    index = repo.index
    # Add all changes
    index.add_all()
    index.write()

    tree = index.write_tree()
    author = Signature('Alice Author', 'alice@authors.tld')
    committer = Signature('Cecil Committer', 'cecil@committers.tld')

    # Create commit
    repo.create_commit(
        APP_GIT_BRANCH,
        author, committer, message,
        tree,
        [] if len(repo.listall_branches()) == 0 else [repo.head.target]
    )

def read_json(filepath):
    try:
        with open(filepath) as data_file:
            return json.load(data_file)
    except IOError:
        raise IOError('Could not read file: '+ filepath)
    except ValueError:
        raise ValueError('Invalid json ' + filepath)

def login():
    username = raw_input("Email: ")
    password = getpass.getpass()
    return username, password
