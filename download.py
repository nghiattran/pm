# !/home/nghia/workplace/my/node/pm/python/env2/bin/python2

# import sys, math, urllib2
#
# toolbar_width = 50
#
# def download(url = None, dest = None):
#     if url is None:
#         print "Error: Missing url."
#         return
#
#     if dest is None:
#         dest = url.split('/')[-1]
#
#     f = open(dest, 'wb')
#     u = urllib2.urlopen(url)
#     meta = u.info()
#
#     total_length = int(meta.getheaders("Content-Length")[0])
#     chunk = int(math.ceil(total_length/(toolbar_width-1)))
#
#     # setup toolbar
#     sys.stdout.write("[%s]" % (" " * toolbar_width))
#     sys.stdout.flush()
#     sys.stdout.write("\b" * (toolbar_width+1)) # return to start of line, after '['
#
#     while True:
#         buffer = u.read(chunk)
#         if not buffer:
#             break
#
#         # Write to file
#         f.write(buffer)
#
#         # Progress bar
#         sys.stdout.write("-")
#         sys.stdout.flush()
#
#     sys.stdout.write("\n")
#     f.close()

import sys, math, urllib2
from clint.textui import progress, colored, puts


def download(url = None, dest = None):
    if url is None:
        print "Error: Missing url."
        return

    if dest is None:
        dest = url.split('/')[-1]

    f = open(dest, 'wb')
    u = urllib2.urlopen(url)
    meta = u.info()

    total_length = int(meta.getheaders("Content-Length")[0])
    chunk = 8000
    toolbar_width = int(math.ceil(total_length/(chunk-1)))

    count = 0
    with progress.Bar(expected_size=toolbar_width) as bar:
        while True:
            buffer = u.read(chunk)
            if not buffer:
                break
            count+=1
            bar.show(count)
            # Write to file
            f.write(buffer)

    sys.stdout.write("\n")
    f.close()

url = "http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4"
download(url, "test.mp4")