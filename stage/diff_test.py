#!/usr/bin/python2.4
from __future__ import print_function
import diff as dmp_module


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

text1 = "hello good to see you there"
text2 = "hello nice to see you, there"

dmp = dmp_module.diff_match_patch()
# diffs = dmp.diff_main(text1, text2, True)
# patches = dmp.patch_make(diffs)
# print bcolors.OKGREEN + "hi" + bcolors.ENDC
# print(diffs)
# for adiff in diffs:
#     if adiff[0] == 0:
#         print(adiff[1], end="")
#     elif adiff[0] == 1:
#         print (bcolors.OKGREEN + adiff[1] + bcolors.ENDC, end="")
#     elif adiff[0] == -1:
#         print (bcolors.FAIL + adiff[1] + bcolors.ENDC, end="")

text1 = open('test_diff1.txt').read()
text2 = open('test_diff2.txt').read()

# diffs = dmp.diff_main(text1, text2, True)
# print(diffs)
# patches = dmp.patch_make(diffs)
# print(patches[0])


patches = dmp.patch_make(text1, text2)
for patch in patches:
    print(patch)
    print(patch.start1)
    print(patch.start2)
    print(patch.length1)
    print(patch.length2)

