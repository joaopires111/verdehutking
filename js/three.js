//IMPORTS
import * as THREE from 'three';
import { GLTFLoader } from 'gtlf';
const cadeiraUrl = new URL('../assets/models/cadeira.gltf', import.meta.url);
const restauranteUrl = new URL('../assets/models/restaurante.gltf', import.meta.url);
const mesaUrl = new URL('../assets/models/mesa.gltf', import.meta.url);
//import { OrbitControls } from 'orbit';

//VARIABLES
const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
const directionlight1 = new THREE.DirectionalLight(0xffffff, 0.5);
const dlighthelper1 = new THREE.CameraHelper(directionlight1.shadow.camera);
const assetLoader = new GLTFLoader();
const animationScripts = [];
let cadeira;

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

    assetLoader.load(cadeiraUrl.href, function (gltf) {
        cadeira = gltf.scene;
        //porque as sombras nao se aplicao ao mesh inteiro
        cadeira.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true
            }
        });
        scene.add(cadeira);
        cadeira.castShadow = true;
        cadeira.position.set(0, 0.12, 0);
        cadeira.scale.set(0.3, 0.3, 0.3);
    },
        // called when loading is in progresses
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        undefined, function (error) {
            console.error(error);
        });
    assetLoader.load(restauranteUrl.href, function (gltf) {
        //porque as sombras nao se aplicao ao mesh inteiro
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
    //ANIMAÇÃO de acordo com cada scroll
    //animação de 0 a 80% do scroll
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

    //animação acima de 80% do scroll
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
    //calculate the current scroll progress as a percentage
    scrollPercent =
        (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    document.getElementById('scrollProgress').innerText =
        'Scroll Progress : ' + scrollPercent.toFixed(2)
}

function animate() {
    playScrollAnimations();
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
