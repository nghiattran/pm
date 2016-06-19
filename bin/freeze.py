from bbfreeze import Freezer


f = Freezer("dist", excludes=['email'])
f.addScript("main.py")
f()