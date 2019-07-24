import * as THREE from '../vendor/three/build/three.module.js';

const SOUNDS = {
    drop: '/assets/sounds/drop.mp3',
    storm: '/assets/sounds/storm-loop.mp3',
    shriek: '/assets/sounds/shriek.mp3',
    wobble: '/assets/sounds/alien-chatter.mp3',
    code: '/assets/sounds/matrix-code.mp3',
};

export const sfx = {
    listener: null,
    buffers: {},
    effects: {},
    load() {
        const audioLoader = new THREE.AudioLoader();

        return new Promise((resolve, reject) => {
            Object.keys(SOUNDS).forEach((id) => {
                audioLoader.load(SOUNDS[id], (buffer) => {
                    this.buffers[id] = buffer;

                    if (Object.keys(this.buffers).length === Object.keys(SOUNDS).length) {
                        resolve(this.buffers);
                    }
                });
            });
        });
    },
    setupEffects(camera) {
        this.listener = new THREE.AudioListener();
        camera.add(this.listener);

        Object.keys(this.buffers).forEach((id) => {
            const sound = new THREE.Audio(this.listener);
            sound.setBuffer(this.buffers[id]);
            this.effects[id] = sound;
        });
    }
};