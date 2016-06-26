import re
import semver

XRANGE_IDENTIFIER = ['x', 'X', '*']
_REGEX_TEXT = '^(?P<major>(?:0|[1-9][0-9]*))' \
               '(\.(?P<minor>[{0}]|[0-9]*))?' \
               '(\.(?P<patch>[{0}]|[0-9]*))?' \
               '(\-(?P<prerelease>[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?' \
               '(\+(?P<build>[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*))?$'
_REGEX_TEXT = _REGEX_TEXT.format(''.join(XRANGE_IDENTIFIER))
_REGEX = re.compile(_REGEX_TEXT)


compare = semver.compare
def satisfies(versions, range=None):
    versions.sort()
    for version in versions:
        print version


def match(version, match_expr):
    pass


def parse(version):
    """
    Parse version to major, minor, patch, pre-release, build parts.
    """
    match = _REGEX.match(version)
    if match is None:
        raise ValueError('%s is not valid SemVer string' % version)

    verinfo = match.groupdict()

    verinfo['major'] = int(verinfo['major'])
    if verinfo['minor'] not in XRANGE_IDENTIFIER:
        verinfo['minor'] = int(verinfo['minor'])

        if verinfo['patch'] not in XRANGE_IDENTIFIER:
            verinfo['patch'] = int(verinfo['patch'])
    else:
        verinfo['minor'] = None

    return verinfo


def max_satisfy(versions, expression):
    # TODO: implement it
    return versions[len(versions) - 1]