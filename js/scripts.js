// Select the background container
//const container = document.getElementById('threejs-background');

//IMPORTS
import * as THREE from 'three';
import { GLTFLoader } from 'gtlf';
const kingUrl = new URL('../assets/king.gltf', import.meta.url);

//RENDERER
const renderer = new THREE.WebGLRenderer();
//renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf1e0be);
document.body.appendChild(renderer.domElement);

//CAMARA E SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 2, 2);
camera.lookAt(scene.position);
console.log("espetáculo");

//LUZES E EFEITOS
const ambientlight = new THREE.AmbientLight(0x9d9d9d, 10);
scene.add(ambientlight);

const directionlight1 = new THREE.DirectionalLight(0x9d9d9d, 20);
directionlight1.position.set(-3, 5, 0);
scene.add(directionlight1);

scene.fog = new THREE.FogExp2(0xffffff, 0.03);

//MODELO 3D
const assetLoader = new GLTFLoader();
assetLoader.load(kingUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, -1, 0);
}, undefined, function (error) {
    console.error(error);
});

//INTERPOLAÇÃO LINEAR
function lerp(x, y, a) {
    return ((1 - a) * x + a * y);
}
/* Used to fit the lerps to start and end at specific scrolling percentages
* eg, 65%
* (65 - 60) / (80 - 60) = 5 / 20 = 25%
* eg , 79%
* (79 - 60) / (80 - 60) = 19 / 20 = 99% */
function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start);
}

let estado = 1;
const animationScripts = [];

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
                if (scene.rotation.y < Math.PI){
                    scene.rotation.y += 0.02;
                }
    },
});
//percorrimento de todas as animações
function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func();
        }
    })
}

//SCROLL PERCENTAGEM e visualização do mesmo
let scrollPercent = 0;
document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent =
        (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    document.getElementById('scrollProgress').innerText =
        'Scroll Progress : ' + scrollPercent.toFixed(2)
}

//-----------------------------------------ANIMATE----------------------------------------------
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

        /* //POSSIVEL IDLE ANIMATION
        if(scene.rotation.x <=0.05 && estado == 1){
            scene.rotateX(0.001);  
            //console.log(scene.rotation.z);          
        } else if(estado == 1) estado = 2; 
        if (scene.rotation.x >= -0.05 && estado == 2){
            scene.rotateX(-0.001);
        } else if (estado == 2) estado = 1;
         */