//IMPORTS
import * as THREE from 'three';
import { GLTFLoader } from 'gtlf';
const restauranteUrl = new URL('../assets/models/restaurante.gltf', import.meta.url);
const mesaUrl = new URL('../assets/models/mesa_cadeiras.gltf', import.meta.url);
//import { OrbitControls } from 'orbit';

//VARIABLES
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
const directionlight1 = new THREE.DirectionalLight(0xffffff, 0.8);
const dlighthelper1 = new THREE.CameraHelper(directionlight1.shadow.camera);
const assetLoader = new GLTFLoader();
const animationScripts = [];
const nrmesas = 15;
const clock = new THREE.Clock();
const mesa = [];
const mixer = [];

//CODE
function StartRenderer() {

    renderer.shadowMap.enabled = true;

    //renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Use a softer shadow type
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xF2E8DF);
    document.body.appendChild(renderer.domElement);
}
StartRenderer();

function CameraAndScene() {
    camera.position.set(0, 2, 2);
    camera.lookAt(scene.position);
    console.log("espetáculo");
}
CameraAndScene();

function lightsAndEffects() {
    scene.add(ambientlight);
    scene.add(directionlight1);
    scene.add(dlighthelper1);

    directionlight1.position.set(-3, 5, 0);
    directionlight1.castShadow = true;

    scene.fog = new THREE.FogExp2(0xffffff, 0.03);
}
lightsAndEffects();

function GLTFloader() {

    for (let i = 0; i <= 14; i++) {
        assetLoader.load(mesaUrl.href, function (gltf) {

            const index = mesa.length; // Ensure a unique index for each model
            mesa[index] = gltf.scene;
            scene.add(mesa[index]);
        
            // Create a mixer for this model
            mixer[index] = new THREE.AnimationMixer(mesa[index]);
        
            // Play all animations for this model
            gltf.animations.forEach((clip) => {
                const action = mixer[index].clipAction(clip);
                action.play();
            });

            console.log(index);

            mesa[index].traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            mesa[index].castShadow = true;
            if (index <= 4) {
                mesa[index].position.set(index * 2 / 3 - 1.5, 0, -0.5);
            } else if (index <= 9) {
                mesa[index].position.set((index - 5) * 2 / 3 - 1.5, 0, 0.5);
            } else {
                mesa[index].position.set((index - 10) * 2 / 3 - 1.5, 0, 0.25);
            }

            mesa[index].scale.set(0.25, 0.25, 0.25);
        },
            // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                if(mixer)console.log(mixer);
            },
            undefined, function (error) {
                console.error(error);
            });
    }

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

function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start);
}

function ScrollAnimation() {

    animationScripts.push({
        start: 0,
        end: 80,
        func: () => {

            scene.rotation.y = Math.PI * scalePercent(0, 80);

            //camera posicao 1 (0, 2, 2)
            //camera posicao 2 (0, 3, 0)

            //ROTACAO DA CAMARA
            if (camera.position.y > 2) {
                camera.lookAt(scene.position);
                camera.position.y -= 0.02;
            }
            if (camera.position.z < 2) {
                camera.position.z += 0.04;
            }
        },
    });

    animationScripts.push({
        start: 80,
        end: 100,
        func: () => {

            //ROTACAO DA CAMARA para o topo
            if (camera.position.y < 3) {
                camera.lookAt(scene.position);
                camera.position.y += 0.02;
            }
            if (camera.position.z > 0) {
                camera.position.z -= 0.04;
            }
            //acerto da rotacao da cena
            if (scene.rotation.y < Math.PI) {
                scene.rotation.y += 0.02;
            }
        },
    });
}
ScrollAnimation();

function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func();
        }
    })
}

let scrollPercent = 0;
document.body.onscroll = () => {
    scrollPercent =
        (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    document.getElementById('scrollProgress').innerText =
        'Scroll Progress : ' + scrollPercent.toFixed(2)
}



function animate() {

    playScrollAnimations();

    mixer.forEach((m) => {
        if (m) { // Ensure the mixer is valid
            m.update(clock.getDelta());
        }
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

renderer.setAnimationLoop(animate);

/*function OPTIONALtestmodeorbit(){
    OrbitControls
const controls = new OrbitControls(
camera, renderer.domElement
);
controls.update();
}*/
