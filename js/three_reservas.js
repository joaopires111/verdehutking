//IMPORTS
import * as THREE from 'three';
import { GLTFLoader } from 'gtlf';
const restauranteUrl = new URL('../assets/models/restaurante2.gltf', import.meta.url);
const mesaUrl = new URL('../assets/models/mesa_cadeiras.gltf', import.meta.url);

//VARIABLES
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
const directionlight1 = new THREE.DirectionalLight(0xffffff, 0.8);
const dlighthelper1 = new THREE.CameraHelper(directionlight1.shadow.camera);
const assetLoader = new GLTFLoader();
const axis = new THREE.Vector3(1,0,0);
const nrmesas = 15;
const mesa = [];
let originmat;
let tempmesas = [];
const cubochair = [];
const orangemat = new THREE.MeshStandardMaterial({ color: 0xbbbb00 });
const redmat = new THREE.MeshStandardMaterial({ color: 0xbb0000 });
window.aplicar = aplicar;
window.reset = reset;
window.linhahover = linhahover;
window.linhahoverout = linhahoverout;
window.linhahoveroutred = linhahoveroutred;
//CODE
function StartRenderer() {

    renderer.shadowMap.enabled = true;

    //renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Use a softer shadow type
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0xF2E8DF);
    document.body.appendChild(renderer.domElement);
}
StartRenderer();

function CameraAndScene() {
    camera.position.set(-4.3, 6, 0);
    camera.setRotationFromAxisAngle(axis, -0.5*Math.PI);
}
CameraAndScene();

function lightsAndEffects() {
    scene.add(ambientlight);
    scene.add(directionlight1);
    //scene.add(dlighthelper1);

    directionlight1.position.set(-3, 5, 0);
    directionlight1.castShadow = true;

    scene.fog = new THREE.FogExp2(0xffffff, 0.03);
    const loader = new THREE.TextureLoader();
    loader.load('assets/img/rosa.jpg', function(texture) {
    scene.background = texture;
});
}
lightsAndEffects();

function GLTFloader() {


        assetLoader.load(mesaUrl.href, function (gltf) {
            for (let i = 0; i <= nrmesas - 1; i++) {
            mesa[i] = gltf.scene.clone();
            scene.add(mesa[i]);

            mesa[i].traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    originmat = child.material;
                }
            });

            if (i <= 4) {
                mesa[i].position.set(i * 2 / 3 - 1.5, 0, -0.5);
            } else if (i <= 9) {
                mesa[i].position.set((i - 5) * 2 / 3 - 1.5, 0, 0.25);
            } else {
                mesa[i].position.set((i - 10) * 2 / 3 - 1.5, 0, 0.5);
            }
            mesa[i].scale.set(0.25, 0.25, 0.25);

            cubochair[i] = new THREE.Box3().setFromObject(mesa[i]);

        //DEBUG
            //const boxHelper = new THREE.Box3Helper(cubochair[i], 0x00ff00); // TESTMODE
            //scene.add(boxHelper);
        }
        },

            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            undefined, function (error) {
                console.error(error);
            });


    assetLoader.load(restauranteUrl.href, function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.receiveShadow = true;
            }
        });
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        scene.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
}
GLTFloader();


function animate() {
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    })

    renderer.setAnimationLoop(animate);

    export function reset() {
        mesa.forEach(m => {
        m.traverse(function (child) {
            if (child.isMesh) {
                child.material = originmat;
            }
        });
    });
    }

    export function aplicar(dia, horario) {
        fetch('../php/reservas/read.php')
            .then(response => response.json())
            .then(items => {
                for (let i = 0; i <= 14; i++) {
                    tempmesas[i] = false;
                }
                if (items.length > 0) {
                    items.forEach(item => {
                        if (item.dia == dia && item.horario == horario) {
                            tempmesas[item.mesa] = true;
                        }
                    });
                }
            })
            .then(() => {
                checkreserva();
            })
    }

    function checkreserva() {
        mesa.forEach((m, i) => {
            if (tempmesas[i]) {
                m.traverse(function (child) {
                    if (child.isMesh) {
                        child.material = redmat;
                    }
                });
            }
            else {
                m.traverse(function (child) {
                    if (child.isMesh) {
                        child.material = originmat;
                    }
                });
            }
        });
    }

    export function linhahover(nrmesa){
                mesa[nrmesa].traverse(function (child) {
                    if (child.isMesh) {
                        child.material = orangemat;
                    }
                });
    }

    export function linhahoverout(nrmesa){
        mesa[nrmesa].traverse(function (child) {
            if (child.isMesh) {
                child.material = originmat;
            }
        });
    }
    export function linhahoveroutred(nrmesa){
        mesa[nrmesa].traverse(function (child) {
            if (child.isMesh) {
                child.material = redmat;
            }
        });
    }