# Inside the Matrix VR

[![MIT](https://img.shields.io/github/license/pazdera/matrix-vr)](https://github.com/pazdera/matrix-vr/blob/master/LICENSE) [![website](https://img.shields.io/website/https/radek.io/matrix-vr)](https://radek.io/matrix-vr/)

<p align="center">
  <img width="640" src="https://user-images.githubusercontent.com/169328/62210934-3d36a080-b395-11e9-93b6-11d873686f34.png">
</p>

This project is a fan remake of the iconic [construct scene](https://youtu.be/AGZiLMGdCE0?t=45) and the [digital rain](https://en.wikipedia.org/wiki/Matrix_digital_rain) from [The Matrix](https://www.imdb.com/title/tt0133093/) for WebVR. I wanted to experiment with VR on the web for some time. Then I found a cool collection of models from the film on [Sketchfab](https://sketchfab.com/rvillani/collections/the-matrix) which gave me the perfect excuse.

I have the [Oculus Quest](https://www.oculus.com/quest/), and that's what I tested it on. Let me know if you run to any issues using other devices. If you don't have a headset, you can also run it in 360-mode.

Have an idea how to make this better? Submit an [issue](https://github.com/pazdera/matrix-vr/issues) or make a PR.

<p align="center">
  <img src="https://user-images.githubusercontent.com/169328/62211026-6f480280-b395-11e9-9d64-cd059663054b.gif">
</p>

## Credits

To build the construct, I used [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/) models by [Rodrigo Villani](https://sketchfab.com/rvillani) and [Sirenko](https://sketchfab.com/sirenko).

For the digital rain, I stole the [msdf font](https://github.com/Rezmason/matrix/blob/master/matrixcode_msdf.png) and some other ideas from Rezmason's much more polished [2D version](https://github.com/Rezmason/matrix).

I also used sound effects by these awesome people:

* [Rain and Thunder Strikes](http://soundbible.com/901-Rain-And-Thunder-Strikes.html) by Mike Koenig [CC-BY-3.0](https://creativecommons.org/licenses/by/3.0/)
* [Freeze](https://freesound.org/people/goac0re1/sounds/333205/) by goac0re1
* [Alien Chatter](https://freesound.org/people/fl1ppy/sounds/149921/) by fl1ppy
* [Matrix Sound 01](https://freesound.org/people/Julien%20Matthey/sounds/105017/) by Julien Matthey

The fonts are [IBM Plex](https://www.ibm.com/plex/) and [Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro).

Thank you all!

## Future Work

* **Add support for controllers** — The original idea was to change the scene only after the user picks up the red pill. I didn't get around to it yet.
* **Randomise the digital rain more** — I was hitting some performance issues, but I'm pretty sure the shader could be improved to make the drops more random.
* **Test with more headsets** — It would be great to know whether this works on Vive/Rift/GearVR etc.
* **Anti-aliasing** — The renderer flag didn't work for me. The FXAA pass was giving me weird flickering results in VR, probably because of something stupid.
* **Refactoring** — The project came out of many hours of experiments within a single file called _texture_shader.html_. You can imagine, it took me a while to untangle :D. There's always more to be done...

## Development

To get this working on your machine, clone the repo as usual and run `yarn` to install the dependencies. Run the following command to start a local server:

```
yarn serve
```

To generate a deployable build, run:

```
yarn build
```

I ended up bundling a slightly modified build of [three.js](http://threejs.org) with the project, mainly to make [post-processing](https://github.com/mrdoob/three.js/pull/15840) work in VR. If you see a weird issue, it's probably my fault.

## Licence

The code in this repo is distributed under the MIT License. See [LICENSE](https://github.com/pazdera/matrix-vr/blob/master/LICENSE) for details.
