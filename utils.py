import getpass
import importlib
import json
from sys import stderr
import semver_adapter
from constants import *
from errors import CleanDirError
from pygit2 import Signature, GIT_OBJ_COMMIT, GIT_SORT_TOPOLOGICAL, GIT_STATUS_CURRENT

# Get all main commands
def get_features():
    return [f for f in listdir(COMMAND_DIR) if not path.isfile(path.join(
        COMMAND_DIR, f))]

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


def commit(repo, message='init package', branch=APP_GIT_BRANCH, init=False,
           pathset=[]):
    print repo.status()

    if repo.status() == {} and not init:
        raise CleanDirError('No changes detected')

    index = repo.index
    # Add all changes to git
    index.add_all()
    index.write()

    tree = index.write_tree()
    author = Signature(USER['name'], USER['email'])

    # Get branch to push
    branch = repo.lookup_branch(branch)

    # Create commit
    repo.create_commit(
        APP_GIT_REF,
        author, author, message,
        tree,
        [] if len(repo.listall_branches()) == 0 else [branch.target]
    )


def create_tag(repo, name, branch=APP_GIT_BRANCH):
    branch = repo.lookup_branch(branch)
    author = Signature(USER['name'], USER['email'])
    target = branch.target
    repo.create_tag(name, target, GIT_OBJ_COMMIT, author, name)


def login():
    username = raw_input("Email: ")
    password = getpass.getpass()
    return username, password


def ask_package_info():
    json = {}
    while "name" not in json or json['name'] == None:
        json['name'] = raw_input("Package name: ")

    while "version" not in json or json['version'] == None:
        try:
            json['version'] = raw_input("Version: ")
            semver_adapter.parse(json['version'])
        except Exception as e:
            json['version'] = None
            print 'A Sematic Version number is required.'

    return json


# Find the root path of a project: check for .coolbee
def find_root(current_path = USER_CURRENT_DIR):
    for f in [tmp for tmp in listdir(current_path) if path.isdir(path.join(
            current_path, tmp))]:
        if f == APP_GIT_FOLDER_NAME:
                return current_path
    return find_root(os.path.dirname(current_path))


# Find the root path of a project: check for json file
def find_root_json(current_path=USER_CURRENT_DIR, target=APP_JSON):
    # If root is reached, raise error
    if path.split(current_path)[1] == '':
        raise IOError('File {0} not found.'.format(target))

    if target in [f for f in listdir(current_path) if path.isfile(path.join(
            current_path, f))]:
        return current_path
    return find_root_json(os.path.dirname(current_path), target=target)

def read_json(filepath):
    try:
        with open(filepath) as data_file:
            return json.load(data_file)
    except IOError:
        raise IOError('Could not read file: '+ filepath)
    except ValueError:
        raise ValueError('Invalid json ' + filepath)


# Read package json in the root project directory
def read_package_json(filename=APP_JSON):
    return read_json(path.join(find_root_json(target=filename), filename))


# Veryfy is the package is initialized correctly
def verify_package():
    # check if the directory is init yet
    # if yes, go on
    # if no, exit
    if not path.isdir(path.join(find_root(), APP_GIT_FOLDER_NAME)):
        stderr.write('Error: This is not a {0} package.\n'.format(APP_NAME))
        exit(1)

    # check if APP_JSON exists
    # if yes, go on
    # if no, exit
    if not path.isfile(path.join(find_root(), APP_JSON)):
        stderr.write('Error: Missing {0} file.\n'.format(APP_JSON))
        exit(1)


def get_commits(repo, target = None, order = GIT_SORT_TOPOLOGICAL):
    if target is None:
        target = repo.head.target

    dict = {}
    for commit in repo.walk(target, order):
        if commit.message in dict.keys():
            raise KeyError('Version must be unique')

        dict[commit.message] = commit
    return dict


def get_commit_list(repo, target = None, order = GIT_SORT_TOPOLOGICAL):
    if target is None:
        target = repo.head.target

    list = []
    commits = get_commits(repo=repo, target=target, order=order)
    for commit in commits:
        list.append(commit)

    return list


# Get all version of a cached package
def get_versions_cached(repo, target = None, order = GIT_SORT_TOPOLOGICAL):
    if target is None:
        target = repo.head.target

    versions = get_commits(repo=repo, target=target, order=order)

    return versions


# Get all engines
def get_engines():
    engines = []
    for file in listdir(ENGINE_DIR):
        if path.isfile(path.join(ENGINE_DIR, file)) \
                and file != '__init__.py' \
                and not is_file_extension(file, extensions = IGNORED_EXTENSIONS):
            name, extesion = path.splitext(file)
            engines.append(name)
    return engines


# Get a engine object
# TODO some how "path= '{0}.{1}'.format(ENGINE_DIR_NAME, engine)" dowsn't
# work as in get_language
def get_engine(engine='default'):
    # path= '{0}.{1}'.format(ENGINE_DIR_NAME, engine)
    path= '{0}.{1}'.format(ENGINE_DIR_NAME, engine)
    module = importlib.import_module(path)
    return getattr(module, engine.capitalize())

