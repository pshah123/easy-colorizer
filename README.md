# Style2Paints

Based off of the original style2paints, but simplified server, async sanic for API, and simple static HTML/CSS/JS web "app".

If you're within the Imperial network, find it [here](http://cloud-vm-46-180.doc.ic.ac.uk). (works on VPN too)

Otherwise, you'll have to spin this up yourself.

Requirements to run the API:
- Python 3.5+ (recommend Anaconda distro)
- Tensorflow (`pip install tensorflow` or if you have an Nvidia GPU `pip install tensorflow_gpu`)
- Sanic and Sanic CORS (`pip install sanic sanic_cors`)
- h5py (`pip install h5py`)
- Keras (`pip install keras`)
- OpenCV (`pip install opencv-python`) (3 works)
- SKImage (`pip install scikit-image`)

Requirements to run the server it ships with:
- [Node 8](https://nodejs.org)
- Express (`npm install express`)

Alternatively, serve with whatever wsgi server you wish or upload to the web host of your choice.

If you run this outside of your own computer, you'll need to edit index.js to fetch the IP/hostname of your API server instead of 127.0.0.1, like so:

``` diff
    ...
    ref: ref
    }
-   fetch('http://127.0.0.1:8000/paint', {
+   fetch('http://my.api:8000/paint')
        method: 'POST',
    ...
```

Run the API with `python api.py` (wait for it to say 'Goin Fast') and the server it ships with using `node app.js`. Website should open index.html, looks like a black screen with two boxes, one with an upload icon. Click the upload box, upload the image of your choosing and wait. On my 1060 w/ 6gb VRAM it takes appr. 10s to predict, on IC server (4@1ghz cpu, 8gb ram) takes 40 seconds. Once it has finished, it will display the image on the right hand side box. Works best with anime pics.

# Changing Colors

The default reference is Rem from Re:Zero, so you'll notice your characters tend to have blue hair and white, maidlike clothing colors. If you'd like to change the reference simply put a different picture to `server/ref` and pass the filename without extension (e.g. `rem` for `server/ref/rem.png`) in the fetch request in `index.js`:

``` diff
    ...
-   let ref = 'rem' // TODO: add ref selection
+   let ref = 'myreference'
    ...
```

I recommend using a large color illustration with as many characters as possible for the manga you're trying to colorize. In the future I plan to add reference selection.

# Developing your own app

The API sends a 400 if the request is malformed with some debugging data, or a 500 if it fails to colorize the image.

# Credits

The original repo and all of the AI work was done by @[lllyasviel](https://github.com/lllyasviel), who made a much more comprehensive web app with Bottle that allows more options and dynamic reference choosing. This refactor is meant to serve as a much more lightweight and simple use case for extensibility purposes, and uses Sanic to simplify async events.