#!/usr/bin/python2

# from pygit2 import init_repository, Repository, Diff, Signature
# import os
# import json
# DIR = ".coolbee"
# current_path = os.getcwd()
# json_file = "coolbee.json"
#
# print current_path
# # repo = init_repository(DIR, bare=True)
#
# data = {
#     "author": "nghia"
# }
# #
# # with open(os.path.join(current_path, json_file), 'w') as outfile:
# #     json.dump(data, outfile)
#
# repo = Repository(DIR)
# # author = Signature('Alice Author', 'alice@authors.tld')
# # committer = Signature('Cecil Committer', 'cecil@committers.tld')
# # tree = repo.TreeBuilder().write()
# # # print tree
# # repo.create_commit(
# #     'refs/heads/master', # the name of the reference to update
# #     author, committer, 'one line commit message\n\ndetailed commit message',
# #     tree, # binary string representing the tree object ID
# #     [] # list of binary strings representing parents of the new commit
# # )
#
#
# print repo.listall_branches()
# # for con in repo.config.__iter__():
# #     print con
# # print repo.diff().patch
# # print repo.listall_branches()
# # tree = repo.revparse_single('HEAD').tree
# # t0 = repo.revparse_single('HEAD').tree
# #
# # print t0.diff_to_tree().patch
# # print diff
# # diff = tree.diff_to_tree(swap=True) # diff to the empty tree
# # print diff.patch
# # for entry in diff:
# #     print entry.patch
#
# # print([p.old_file_path for p in diff])

from coolbee.utils import find_root

print find_root()