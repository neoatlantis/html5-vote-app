#!/usr/bin/env python3

from PIL import Image
import os

filenames = os.listdir("./countries")

tile_w, tile_h = 0, 0

images = []

for filename in filenames:
    fullpath = os.path.join("countries", filename)

    image_i = Image.open(fullpath)

    w, h = image_i.size
    tile_w = max(tile_w, w)
    tile_h = max(tile_h, h)

    images.append((filename, image_i, image_i.size))

images.sort(key=lambda e: e[0])

output_w = tile_w
output_h = tile_h * len(images)

output_image = Image.new(image_i.mode, (output_w, output_h))

for i in range(0, len(images)):
    paste_y = i * tile_h
    paste_x = 0
    image_w, image_h = images[i][2]
    fix_w = round((tile_w - image_w) / 2)
    fix_h = round((tile_h - image_h) / 2)

    paste_x += fix_w
    paste_y += fix_h

    output_image.paste(images[i][1], (
        paste_x, paste_y, paste_x + image_w, paste_y + image_h
    ))


output_image.save("share_flags.png")
