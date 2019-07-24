import * as THREE from '../vendor/three/build/three.module.js';

const loader = new THREE.TextureLoader();
const texture = loader.load('/assets/matrixcode_msdf.png');

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const fragmentShader = `
    #include <common>

    #define FONT_W 8.0
    #define FONT_H 8.0
    #define GLYPH_W (1.0/FONT_W)
    #define GLYPH_H (1.0/FONT_W)


    uniform float time;
    uniform float speed;
    uniform float fadeRate;
    uniform float length;
    uniform float seed;
    uniform sampler2D font;
    varying vec2 vUv;

    float median(float r, float g, float b) {
        return max(min(r, g), min(max(r, g), b));
    }

    float rand(float seed) {
        return fract(sin(dot(vec2(seed, seed), vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
        vec2 vUv2 = vec2(vUv.x, 1.0 - vUv.y);
        vec2 phase = fract(vUv / vec2(1.0, 1.0 / length));
        float index = floor(vUv2.y / (1.0 / length));

        float step = floor(time / speed);
        // if (step > length) {
        //     index = index - (step - length);
        // }

        // vec3 baseColor = vec3(0.250, 1, 0.250);
        vec3 baseColor = vec3(0.066, 0.894, 0.270);
        if (index == step - 1.0) {
            baseColor = vec3(0.9);
        }

        float fade = (step - index) * fadeRate;
        if (index >= step) {
            fade = 1.0;
        }

        float glyphIndex = floor(57.0 * rand(seed + 1234.0 * index));
        float row = floor(glyphIndex / FONT_W);
        float glyphColumn = glyphIndex - row * FONT_W;
        float glyphRow = FONT_W - 1.0 - row;

        vec2 tc = vec2(glyphColumn * GLYPH_W + phase.x * GLYPH_W, glyphRow * GLYPH_H + phase.y * GLYPH_H);
        vec4 sample = texture2D(font, tc);

        float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
        float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
        gl_FragColor = vec4(baseColor, (alpha - fade));
    }
`;

export class Particle {
    constructor(x, y, z, length) {
        this.uniforms = {
            font: { value: texture },
            time: { value: 0.0 },
            speed: { value: 50.0 },
            fadeRate: { value: 0.08 },
            length: { value: length },
        };

        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, length),
            new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader,
                fragmentShader,
                transparent: true,
            }),
        );

        this.startTime = 0;
        this.cycleLength = (length + Math.ceil(1 / this.uniforms.fadeRate.value)) * this.uniforms.speed.value;

        this.mesh.material.side = THREE.DoubleSide;
        this.mesh.material.extensions.derivatives = true;
        this.mesh.material.depthWrite = false;

        this.mesh.position.set(x, y, z);
        this.mesh.rotation.y = Math.atan2(x, z);
        this.mesh.visible = false;
    }

    show() {
        this.mesh.visible = true;
    }

    hide() {
        this.mesh.visible = false;
    }

    setSpeed(speed) {
        this.uniforms.speed.value = speed;
    }

    update(time) {
        if (this.mesh.visible) {
            if (time - this.startTime > this.cycleLength) {
                this.startTime = time;
            }
        }
        this.uniforms.time.value = time - this.startTime;
    }
}
