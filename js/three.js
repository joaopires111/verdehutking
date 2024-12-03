//IMPORTS
import * as THREE from 'three';
import { GLTFLoader } from 'gtlf';  
//import { OrbitControls } from 'orbit';
const cadeiraUrl = new URL('../assets/cadeira.gltf', import.meta.url);
const restauranteUrl = new URL('../assets/restaurante.gltf', import.meta.url);

    //-------------------------------Tabela Mesas------------------------------------------

    //-------------------------------THREE.JS-----------------------------------------------
//RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;

//renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: Use a softer shadow type
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xF2E8DF);
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
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientlight);

const directionlight1 = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionlight1);
directionlight1.position.set(-3, 5, 0);
directionlight1.castShadow = true;

const dlighthelper1 = new THREE.CameraHelper(directionlight1.shadow.camera);
scene.add(dlighthelper1);
scene.fog = new THREE.FogExp2(0xffffff, 0.03);

//--------------------------------------MODELO 3D-------------------------------------------
var cadeira;
const assetLoader = new GLTFLoader();
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
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
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

/*OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();*/
//--------------------------SCROLL ANIMATION------------------------------

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
        if (scene.rotation.y < Math.PI) {
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

