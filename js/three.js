//IMPORTS
import * as THREE from 'three';
import { GLTFLoader } from 'gtlf';
const restauranteUrl = new URL('../assets/models/restaurante.gltf', import.meta.url);
const mesaUrl = new URL('../assets/models/mesa_cadeiras.gltf', import.meta.url);
//DEBUG
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
let delta;
const mesa = [];
const mixer = [];
const action = [];
let scrollPercent = 0;
const mouse = new THREE.Vector2();
const intersectionpoint = new THREE.Vector3();
const cubochair = [];
const raycaster = new THREE.Raycaster();
let arrow;
const framerate = 30;
let estado = false;
let animatehover = -1;
const starttime = 0;
const endtime = 0.2;
let lastanimatehover = -2;
let rayoffon = true;


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

    for (let i = 0; i <= nrmesas - 1; i++) {
        assetLoader.load(mesaUrl.href, function (gltf) {

            mesa[i] = gltf.scene.clone();
            scene.add(mesa[i]);
            
            console.log('mixer: '+ i);
            mixer[i] = new THREE.AnimationMixer(mesa[i]);
            gltf.animations.forEach((clip, c) => {
                action[i*2 + c] = mixer[i].clipAction(clip);
                //action[i*2 + c].setLoop(THREE.LoopOnce, 1); // Play once
                //action[i*2 + c].clampWhenFinished = true;   // Clamp to the last frame when finished
                action[i*2 + c].time = starttime;           // Start at the beginning
                action[i*2 + c].setEffectiveTimeScale(5);  // Normal playback speed
                action[i*2 + c].play();
                console.log('action: ' + (i*2 + c));
            });



            mesa[i].traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            mesa[i].castShadow = true;
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
            const boxHelper = new THREE.Box3Helper(cubochair[i], 0x00ff00); // TESTMODE
            scene.add(boxHelper);

        },

            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
            estado = false;
            scene.rotation.y = Math.PI* 2 * scalePercent(0, 80);

            //camera posicao 1 (0, 2, 2)
            //camera posicao 2 (0, 3, 0)

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
        end: 101,
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
            if (scene.rotation.y < 2*Math.PI) {
                scene.rotation.y += 0.01;
            }else {
                hovertableanimation();
            }
        },
    });
}
ScrollAnimation();

function hovertableanimation(){
    raycaster.setFromCamera(mouse, camera);
    //DEBUG
    //arrow = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 8, 0xff0000);
    //scene.add(arrow);
    
    console.log(animatehover);
    if(rayoffon){
    cubochair.forEach((c, i) => {
        if (raycaster.ray.intersectsBox(c)) {
            animatehover = i;
        }
    });
}
}

window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', function (e) {

});

function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func();
        }
    })
}

document.body.onscroll = () => {
    scrollPercent =
        (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    document.getElementById('scrollProgress').innerText =
        'Scroll Progress : ' + scrollPercent.toFixed(2)
}

function playanimatehover(){

    if(action[animatehover*2].time <= 2){
        delta = clock.getDelta();
        mixer[animatehover].update(delta);
        rayoffon = false;
    }
    else{
        action[animatehover*2].time = starttime;
        action[animatehover*2+1].time = starttime;
        lastanimatehover = animatehover;
        animatehover = -1;
        rayoffon = true;
    }    

        
}

function animate() {
    playScrollAnimations();
    if (animatehover > -1 && animatehover != lastanimatehover){
        playanimatehover();
    } 

    
    renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

renderer.setAnimationLoop(animate);

//DEBUG
/*function OPTIONALtestmodeorbit(){
    OrbitControls
const controls = new OrbitControls(
camera, renderer.domElement
);
controls.update();
}*/
