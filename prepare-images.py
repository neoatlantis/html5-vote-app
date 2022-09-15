#!/usr/bin/env python3

import json
import os

start = "./images"
base = os.listdir(start)

output = {}

for stagedir in base:
    stagedir_full = os.path.join(start, stagedir)
    if not os.path.isdir(os.path.join(stagedir_full)):
        continue

    for imagename in os.listdir(stagedir_full):
        imagefullpath = os.path.join(stagedir_full, imagename)
        imagesize = os.path.getsize(imagefullpath)

        imagerefname = os.path.splitext(imagename)[0]
        print(imagerefname, imagefullpath, imagesize)

        output[imagerefname] = {
            "path": imagefullpath,
            "size": imagesize,
        }


open("./app/image_resource_list.js", "w+").write(
    "export default %s;" % json.dumps(output))
