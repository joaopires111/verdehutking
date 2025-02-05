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
const greenmat = new THREE.MeshStandardMaterial({ color: 0x00bb00 });
const redmat = new THREE.MeshStandardMaterial({ color: 0xbb0000 });
let originmat;
let tempmesas = [];
export let mesaselecionada = [];
window.mesaselecionada = mesaselecionada;
let modalon = true;
let fimdepagina = false;
let currentSection = 0;
for (let i = 0; i <= 14; i++) {
    mesaselecionada[i] = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    const indicators = document.querySelectorAll('.indicator span');
    const scrollProgress = document.getElementById('scrollProgress');

    currentSection = 0;
    let scrolling = false; // Prevents rapid scroll jumps

    function smoothScrollTo(targetPosition, duration = 800) {
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function animationStep(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            window.scrollTo(0, startPosition + distance * easeInOutQuad(progress));

            if (progress < 1) {
                requestAnimationFrame(animationStep);
            } else {
                scrolling = false; // Allow next scroll event
            }
        }

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        requestAnimationFrame(animationStep);
    }

    function updateView() {
        if (scrolling) return; // Prevents spam scrolling

        scrolling = true;
        const targetPosition = sections[currentSection].getBoundingClientRect().top + window.scrollY;
        smoothScrollTo(targetPosition, 800);

        // Update indicator
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSection);
        });

        // Update scroll percentage
        let scrollPercent = ((currentSection) / (sections.length - 1)) * 100;
        scrollProgress.innerText = 'Scroll Progress: ' + scrollPercent.toFixed(2) + '%';
    }



    // Detect scroll wheel movement
    window.addEventListener('wheel', (event) => {
        if (scrolling) return; // Prevent spam scrolling

        if (event.deltaY > 0 && currentSection < sections.length - 1) {
            // Scrolling down
            currentSection++;
        } else if (event.deltaY < 0 && currentSection > 0) {
            // Scrolling up
            currentSection--;
        }
        updateView();
    });

    // Detect touch scrolling (for mobile)
    let touchStartY = 0;
    window.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });

    window.addEventListener('touchend', (event) => {
        if (scrolling) return;

        let touchEndY = event.changedTouches[0].clientY;
        let deltaY = touchStartY - touchEndY;

        if (deltaY > 50 && currentSection < sections.length - 1) {
            // Swipe up (scroll down)
            currentSection++;
        } else if (deltaY < -50 && currentSection > 0) {
            // Swipe down (scroll up)
            currentSection--;
        }
        updateView();
    });

    // Disable manual scrolling
    document.body.style.overflow = 'hidden';

    // Initialize view
    updateView();
});



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
    //scene.add(dlighthelper1);

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
            mixer[i] = new THREE.AnimationMixer(mesa[i]);
            gltf.animations.forEach((clip, c) => {
                action[i * 2 + c] = mixer[i].clipAction(clip);
                //action[i*2 + c].setLoop(THREE.LoopOnce, 1); // Play once
                //action[i*2 + c].clampWhenFinished = true;   // Clamp to the last frame when finished
                action[i * 2 + c].time = starttime;           // Start at the beginning
                action[i * 2 + c].setEffectiveTimeScale(5);  // Normal playback speed
                action[i * 2 + c].play();
            });

            mesa[i].traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    originmat = child.material;
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
            //const boxHelper = new THREE.Box3Helper(cubochair[i], 0x00ff00); // TESTMODE
            //scene.add(boxHelper);
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
            fimdepagina = false;
            estado = false;
            scene.rotation.y = Math.PI * 2 * scalePercent(0, 80);

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
            if (scene.rotation.y < 2 * Math.PI) {
                scene.rotation.y += 0.01;
            } else {
                fimdepagina = true;
                hovertableanimation();
            }
        },
    });
}
ScrollAnimation();

function hovertableanimation() {
    raycaster.setFromCamera(mouse, camera);
    //DEBUG
    //arrow = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 8, 0xff0000);
    //scene.add(arrow);

    //console.log(animatehover);
    if (rayoffon) {
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
    if(modalon && fimdepagina){
    cubochair.forEach((c, i) => {
        if (raycaster.ray.intersectsBox(c) && !tempmesas[i]) {
            if (!mesaselecionada[i]) {
                mesa[i].traverse(function (child) {
                    if (child.isMesh) {
                        child.material = greenmat;
                    }
                });
                mesaselecionada[i] = true;
            } else{

                mesa[i].traverse(function (child) {
                    if (child.isMesh) {
                        child.material = originmat;
                    }
                });
                mesaselecionada[i] = false;
            }
        }
    });
}
});

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
            console.log(tempmesas);
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
    console.log("CHECKINGS !!");
}

export function fazerreserva(nome, telemovel, dia, horario) {
    mesaselecionada.forEach((m , i) => {
        if(m){
            fetch('../php/reservas/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({nome, telemovel, i, dia, horario})
            })
            .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text(); // Read response as plain text
              })
                .then(() => {
                        mesa[i].traverse(function (child) {
                            if (child.isMesh) {
                                child.material = redmat;
                            }
                        });
                    m = false; 
                    console.log("ESTADO DA MESA "+i+" "+m);
                });
        }
    });
}

export function restartmodal(){
    setTimeout(() => {
        modalon = true;
        console.log("MODAL ON");
      }, 100);
}

export function cancelmodal(){
        modalon = false;
        console.log("MODAL OFF");
}

window.cancelmodal = cancelmodal;
window.restartmodal = restartmodal;
window.fazerreserva = fazerreserva;
window.aplicar = aplicar;

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

function playanimatehover() {

    if (action[animatehover * 2].time <= 2) {
        delta = clock.getDelta();
        mixer[animatehover].update(delta);
        rayoffon = false;
    }
    else {
        action[animatehover * 2].time = starttime;
        action[animatehover * 2 + 1].time = starttime;
        lastanimatehover = animatehover;
        console.log("hover: " +animatehover);
        animatehover = -1;
        rayoffon = true;
    }
}

function animate() {
    playScrollAnimations();
    if (animatehover > -1 && animatehover != lastanimatehover) {
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
