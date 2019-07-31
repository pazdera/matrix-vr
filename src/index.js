
import * as THREE from '../vendor/three/build/three.module.js';
import { OrbitControls } from '../vendor/three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from '../vendor/three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../vendor/three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { construct } from './construct.js';
import { Particle, DigitalRain } from './particles.js';
import { sfx } from './sfx.js';
import { EnterVR } from './vr.js';
import { animate, lerp, EasingFunctions } from './animations.js';
import { ui } from './ui.js'

const canvas = document.querySelector('#canvas');

/* Renderer setup */
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

/* Setup postprocessing */
const composer = new EffectComposer(renderer);
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0, 0.5, 0);
bloom.renderToScreen = true;
composer.addPass(bloom);

/* Create scene */
const scene = new THREE.Scene();
let sceneStage = 'intro';
scene.background = new THREE.Color(0xffffff);

renderer.setRenderTarget(composer.readBuffer);
scene.onAfterRender = () => {
    composer.render();
};

const vr = new EnterVR();
vr.onStateChange = (state) => {
    switch (state) {
        case 'ready':
            ui.displayButton('vr');
            ui.showToggleVR(ui.overlay.style.display === 'none');
            break;
        case 'in-progress':
            /* Delay showing the button to prevent flickering */
            setTimeout(() => ui.showToggleVR(true), 500);
            break;
        case 'uninitialised':
        case 'not-available':
        default:
            ui.displayButton('360');
            ui.showToggleVR(false);
            break;
    }
};

vr.prepare(renderer);
ui.setupListeners(vr, startConstruct);

/* Setup camera */
let landscapeFOV = 20;
let portraitFOV = 70;
let landscapeInitialCameraPosition = { x: -7.6, y: 1.3, z: -7.6 };
let portraitInitialCameraPosition = { x: -4, y: 1.5, z: -4 };
const aspect = canvas.clientWidth / canvas.clientHeight;
const fov = aspect >= 1 ? landscapeFOV : portraitFOV;
let pos = aspect >= 1 ? landscapeInitialCameraPosition : portraitInitialCameraPosition;
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 500);
camera.position.set(pos.x, pos.y, pos.z);
camera.up = new THREE.Vector3(0, 1, 0);
camera.lookAt(0, 0.6, 0);

window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);

    camera.aspect = w / h;
    camera.fov = camera.aspect >= 1 ? landscapeFOV : portraitFOV;

    /* On the intro screen, position needs adjusting too */
    if (sceneStage === 'intro') {
        const pos = camera.aspect >= 1 ? landscapeInitialCameraPosition : portraitInitialCameraPosition;
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(0, 0.6, 0);
    }
    camera.updateProjectionMatrix();
});

/* Start loading assets */
const sfxPromise = sfx.load();
const constructPromise = construct.setup((p) => ui.updateProgress(p));
Promise.all([sfxPromise, constructPromise]).then(() => {
    scene.add(construct.object);
    construct.reflectCamera.update(renderer, scene);
    construct.refractCamera.update(renderer, scene);

    sfx.setupEffects(camera);

    ui.hideProgress();
    setTimeout(() => ui.fadeIn(), 600);
});

/* Throttled render loop for the intro screen */
let introRender = null;
function introRenderLoop(maxFPS = 5) {
    const interval = 1000 / maxFPS;
    let lastRun = 0;
    const loop = (now) => {
        if (now - lastRun >= interval) {
            renderer.render(scene, camera);
            lastRun = now;
        }
        introRender = requestAnimationFrame(loop);
    };
    introRender = requestAnimationFrame(loop);
}

function renderLoop() {
    renderer.setAnimationLoop((time) => {
        if (drops) {
            drops.update(time);
        }
        if (controls) {
            controls.update();
        }
        renderer.render(scene, camera);
    });
}

/* Start render loop */
introRenderLoop();

let controls;
let drops;
const dolly = new THREE.Group();

function startConstruct() {
    sceneStage = 'construct';

    /* Use different FOV in the construct */
    landscapeFOV = 70;
    portraitFOV = 110;

    ui.hideOverlay();

    sfx.effects.shriek.play();
    sfx.effects.storm.setLoop(true);
    sfx.effects.storm.setVolume(0.5);
    setTimeout(() => sfx.effects.storm.play(), 3400);

    /* Switch render loops */
    cancelAnimationFrame(introRender);
    renderLoop();

    setTimeout(() => {
        const targetFOV = camera.aspect >= 1 ? landscapeFOV : portraitFOV;
        const startFOV = camera.fov;
        const startPos = Object.assign({}, camera.position);
        animate(2000, 30, (n) => {
            const x = lerp(startPos.x, -2, n);
            const y = lerp(startPos.y, 1.3, n);
            const z = lerp(startPos.z, -2, n);

            const rotSpeed = Math.PI * n;
            camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
            camera.position.y = y;
            camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);

            camera.fov = lerp(startFOV, targetFOV, n);
            camera.lookAt(0, 0.6, 0);
            camera.updateProjectionMatrix();

            /* Fill light */
            bloom.threshold = lerp(1, 0, n);
            bloom.strength = lerp(0, 1, n);
        }, EasingFunctions.easeInQuad).then(() => {
            /* Start with fill light on */
            bloom.threshold = 0;
            bloom.strength = 2.5;
            if (vr.available) {
                renderer.vr.enabled = true;
                dolly.add(camera);
                scene.add(dolly);
                dolly.position.set(2.0, -0.25, -1.05);
                dolly.rotation.y += Math.PI / 2;
                vr.startSession();
            } else {
                /* Trial and error weirdness. Fix later. */
                camera.position.set(2.0, 0.5, -1.05);
                const q = new THREE.Quaternion();
                q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI*(-1/180));
                camera.position.applyQuaternion(q);

                /* Allow camera rotation */
                controls = new OrbitControls(camera, canvas);
                controls.target.set(
                    2.0 * 0.9,
                    0.5 * 0.9,
                    -1.05 * 0.9
                );
                controls.enableZoom = false;
                controls.enablePan = false;
            }
            setTimeout(() => {
                animate(1000, 30, (n) => {
                    /* Fade in */
                    bloom.strength = lerp(2.5, 0, n);
                }).then(() => {
                    setTimeout(startRain, 10000);
                });
            }, 1000);
        });
    }, vr.available ? 1200 : 1300);
}

function startRain() {
    sceneStage = 'rain';

    /* Remove the construct */
    animate(2000, 30, (n) => {
        const rN = 1 - n;
        construct.object.position.y = lerp(0, -50, n);
        scene.background.setRGB(rN, rN, rN);
    }, EasingFunctions.easeOutQuad).then(() => {
        scene.remove(construct.object);
    });

    drops = new DigitalRain(1500);
    scene.add(drops.mesh);

    sfx.effects.storm.stop();

    sfx.effects.drop.setVolume(0.7);
    sfx.effects.drop.play();

    bloom.threshold = 0.22;
    bloom.strength = 1.0;

    if (vr.available) {
        bloom.strength = 1.3;

        /* Center the camera */
        dolly.position.set(0, 0, 0);
    } else {
        /* Reconfigure orbit controls */
        camera.fov = camera.aspect >= 1 ? landscapeFOV : portraitFOV;
        camera.position.set(0, 0, 0);
        controls.enableZoom = true;
        controls.maxDistance = 50;
        controls.target.set(0.1, 0, 0);
        camera.updateProjectionMatrix();
    }

    setTimeout(() => {
        sfx.effects.code.setLoop(true);
        sfx.effects.code.play();

        setTimeout(() => {
            sfx.effects.wobble.setLoop(true);
            sfx.effects.wobble.play();
        }, 8000);
    }, 1000);
}
