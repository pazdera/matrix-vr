import * as THREE from '../vendor/three/build/three.module.js';
import { GLTFLoader } from '../vendor/three/examples/jsm/loaders/GLTFloader.js';

const MODELS = {
    chair: '/assets/models/chair/scene.gltf',
    table: '/assets/models/table/scene.gltf',
    glass: '/assets/models/glass/scene.gltf',
    tv: '/assets/models/tv/scene.gltf',
    pill: '/assets/models/pill/scene.gltf',
};

export const construct = {
    object: null,

    load() {
        return new Promise((resolve, reject) => {
            const ids = Object.keys(MODELS);
            const objects = {};

            const modelLoader = new GLTFLoader();
            ids.forEach((id) => {
                const path = MODELS[id];

                modelLoader.load(
                    path,
                    (gltf) => {
                        objects[id] = gltf.scene;
                        if (Object.keys(objects).length === ids.length) {
                            resolve(objects);
                        }
                    },
                    null,
                    (error) => {
                        reject(error);
                    }
                );
            });
        });
    },

    setup() {
        const construct = new THREE.Group();
        this.object = construct;

        const reflectCamera = new THREE.CubeCamera(0.01, 50, 512);
        this.reflectCamera = reflectCamera;
        construct.add(reflectCamera);

        const refractCamera = new THREE.CubeCamera(0.01, 50, 512);
        this.refractCamera = refractCamera;
        refractCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping;
        construct.add(refractCamera);

        /* Floor */
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(25, 25),
            new THREE.MeshBasicMaterial({color: 0xffffff}),
        );
        floor.material.side = THREE.DoubleSide;
        floor.rotation.x -= Math.PI / 2;
        floor.position.y = -1;
        // construct.add(floor);

        /* Lighting */
        const light1 = new THREE.DirectionalLight(0xffffff, 2.0);
        light1.position.set(0.5, 0, 0.866);
        construct.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 8.0);
        light2.position.set(-5, 8, -5);
        construct.add(light2);

        var light3 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        construct.add(light3);

        return this.load()
            .then((objects) => {
                // Chairs
                const chair1 = objects.chair;
                const chair2 = chair1.clone();

                chair1.position.x = -1.0;
                chair1.position.z = 2.0;
                chair1.rotation.y += (Math.PI / 60);

                chair2.position.x = 2.0;
                chair2.position.z = -1.0;
                chair2.rotation.y += (Math.PI / 2) - (Math.PI / 60);

                construct.add(chair1)
                construct.add(chair2)

                // TV
                const tv = objects.tv;
                tv.position.x = -2.0;
                tv.position.z = -2.0;
                tv.position.y = -0.2;
                tv.rotation.y += (Math.PI / 4);
                tv.scale.set(0.8, 0.8, 0.8);

                construct.add(tv);

                // table
                const table = objects.table;
                table.position.x = 0;
                table.position.z = 0;
                table.position.y = -0.5;
                table.scale.set(0.5, 0.5, 0.5);

                construct.add(table);

                // glass
                const glass = objects.glass;
                glass.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material.envMap = reflectCamera.renderTarget.texture;
                    }
                });
                glass.position.x = 0;
                glass.position.z = 0;
                glass.position.y = 0.1;
                glass.scale.set(0.05, 0.05, 0.05);

                construct.add(glass);

                // pills
                const red = objects.pill;
                const blue = red.clone()

                red.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xff0000,
                            envMap: refractCamera.renderTarget.texture,
                            refractionRatio: 0.8,
                            roughness: 0,
                            metalness: 0.6,
                        });
                    }
                });

                red.position.x = 0.1;
                red.position.z = 0.05;
                red.position.y = 0.0;
                red.scale.set(0.05, 0.05, 0.05);
                red.rotation.x -= (Math.PI / 2);

                blue.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0x0000ff,
                            envMap: refractCamera.renderTarget.texture,
                            refractionRatio: 0.8,
                            roughness: 0,
                            metalness: 0.6
                        });
                    }
                });

                blue.position.x = 0.05;
                blue.position.z = -0.1;
                blue.position.y = 0.0;
                blue.scale.set(0.05, 0.05, 0.05);
                blue.rotation.x -= (Math.PI / 2);

                construct.add(red);
                construct.add(blue);

                return construct;
            });
    },
    updateEnvMap() {
        this.refractCamera.update();
    }
};
