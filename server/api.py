import os
import time

from tricks import *
from ai import *
from config import *

import base64
import re
import cv2
import numpy as np

from sanic import Sanic
from sanic.response import text, file
from sanic_cors import CORS, cross_origin
app = Sanic()
CORS(app)


@app.route('/sketch/<name>')
async def serve(q, name):
    try:
        return await file('data/' + name + '.fin.jpg')
    except:
        return text('File not found.', status=404)

@app.route('/paint', methods=['OPTIONS'])
async def preflight(q):
    return text('OK', status=200)

@app.route('/paint', methods=['POST'])
async def paint(q):
    name = q.json.get('name')
    if not name:
        return text('No name!', status=400)

    try:
        sketchURI = base64.urlsafe_b64decode(
            re.sub('^data:image/.+;base64,', '', q.json.get('sketch')))
    except:
        return text('Sketch is not base64!', status=400)
    sketch = cv2.imdecode(np.fromstring(sketchURI, dtype=np.uint8), -1)

    try:
        ref = cv2.imread('ref/' + q.json.get('ref') + '.png', cv2.IMREAD_UNCHANGED)
        print(ref.shape)
    except:
        return text('Reference not valid!', status=400)

    hint = np.copy(sketch)
    try:
        hint[:, :, 4] = 0
    except:
        hint = np.zeros((sketch.shape[0], sketch.shape[1], 4), dtype=np.uint8)
        pass
    print(hint.shape)

    cv2.imwrite('data/' + name + '.sketch.png', sketch)
    cv2.imwrite('data/' + name + '.hint.png', hint)

    try:
        t = time.time()

        sketch = from_png_to_jpg(sketch)
        raw_shape = sketch.shape

        print("PNGified sketch (%02fs)" % (time.time() - t))

        local_hint = hint
        global_hint = k_resize(x=s_enhance(
            from_png_to_jpg(ref), 2.0), k=14)
        local_hint[:, :, 0:3] = s_enhance(local_hint[:, :, 0:3], 1.5)

        print("Got global and local hints (%02fs)" % (time.time() - t))

        norm_path = 'data/' + name + '.norm.jpg'

        sketch = m_resize(sketch, min(
            sketch.shape[0], sketch.shape[1], 512))
        sketch = go_tail(sketch, noisy=True)
        sketch = k_resize(sketch, 48)
        sketch = cv2.cvtColor(sketch, cv2.COLOR_RGB2GRAY)

        cv2.imwrite('data/' + name + '.norm.jpg', sketch)
        print("Normalized sketch (%02fs)" % (time.time() - t))

        t = time.time()
        local_hint = k_down_hints(local_hint)
        local_hint = d_resize(local_hint, sketch.shape)
        painting = go_neck(sketch, global_hint, local_hint)
        print('paint: ' + str(time.time() - t))

        t = time.time()
        fin = go_tail(painting, noisy=True)
        fin = s_resize(fin, raw_shape)
        print('denoise: ' + str(time.time() - t))

        cv2.imwrite('data/' + name + '.fin.jpg', fin)

        return text(name, status=200)

    except Exception as e:
        print(e)
        return text(e, status=500)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
