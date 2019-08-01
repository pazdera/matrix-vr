# Inside the Matrix VR

![GitHub](https://img.shields.io/github/license/pazdera/matrix-vr) ![website](https://img.shields.io/website/https/radek.io/matrix-vr)

This project is a fan remake of the iconic [construct scene](https://youtu.be/AGZiLMGdCE0?t=45) and the [digital rain](https://en.wikipedia.org/wiki/Matrix_digital_rain) from [The Matrix](https://www.imdb.com/title/tt0133093/) for WebVR. I wanted to experiment with VR on the web for some time. Then I found a cool collection of models from the film on [Sketchfab](https://sketchfab.com/rvillani/collections/the-matrix) which gave me the perfect excuse.

I have the [Oculus Quest](https://www.oculus.com/quest/), and that's what I tested it on. Let me know if you run to any issues using other devices. If you don't have a headset, you can also run it in 360-mode.

Have an idea how to make this better? Submit an [issue](https://github.com/pazdera/matrix-vr/issues) or make a PR.

![Intro Screen](https://user-images.githubusercontent.com/169328/62210934-3d36a080-b395-11e9-93b6-11d873686f34.png)

<p align="center">
  <img src="https://user-images.githubusercontent.com/169328/62211026-6f480280-b395-11e9-9d64-cd059663054b.gif">
</p>

## Credits

To build the construct, I used [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/) models by [Rodrigo Villani](https://sketchfab.com/rvillani) and [Sirenko](https://sketchfab.com/sirenko).

For the digital rain, I stole the [msdf font](https://github.com/Rezmason/matrix/blob/master/matrixcode_msdf.png) and some ideas from Rezmason' much more polished [2D version](https://github.com/Rezmason/matrix) of the digital rain.

I also used sound effects by these awesome people:

* [Rain and Thunder Strikes](http://soundbible.com/901-Rain-And-Thunder-Strikes.html) by Mike Koenig [CC-BY-3.0](https://creativecommons.org/licenses/by/3.0/)
* [Freeze](https://freesound.org/people/goac0re1/sounds/333205/) by goac0re1
* [Alien Chatter](https://freesound.org/people/fl1ppy/sounds/149921/) by fl1ppy
* [Matrix Sound 01](https://freesound.org/people/Julien%20Matthey/sounds/105017/) by Julien Matthey

The fonts are [IBM Plex](https://www.ibm.com/plex/) and [Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro).

## Future Work

* Test on other devices
* Add support for controllers. The original idea was to take a pill from the table.
* Anti-aliasing. The built-in one or FXAA didn’t work for me in VR.
* Digital rain more randomised. I was hitting performance issues with 1500 strands.
* More cleanup. The file that this originally came from was called texture shader. It went through many hours of experimentation. I am not motivated to refactor further at this point, but there are places that need it.

## Develop

To get this demo working on your machine, run `yarn` to install the dependencies, then:

```
yarn serve
```

To make a deployable build, run:

```
yarn build
```


Three.js, I ended up bundling a custom build of three.js with a few minor modifications, so if you see a weird issue, it's probably my fault.


## Licence

The code in this repo is distributed under the MIT License. See [LICENSE](https://github.com/pazdera/matrix-vr/blob/master/LICENSE) for details.
