import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 1️⃣ Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// 2️⃣ Add Lighting

// 3️⃣ Load the GLTF Model
let model; // Declare model globally

const loader = new GLTFLoader();
loader.load(
    './model.glb',  
    (gltf) => {
        model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0);  
        controls.enabled = false; // Disable user controls initially
        // Start the sequence of animation functions
        model.rotation.y=100;
        rotateModel();
    },
    (xhr) => {
        console.log(`Model ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error("Error loading model:", error);
    }
);

// 4️⃣ Set Camera Position
camera.position.set(0, 1, 3);

// 5️⃣ Orbit Controls (Mouse Interaction)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 6️⃣ Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// 7️⃣ Handle Window Resize
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);

renderer.physicallyCorrectLights = true;

window.addEventListener("resize", () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

function updateCamera() {
    if (window.innerWidth < 480) {
        camera.position.set(0, 4, 11); // Adjust for small screens
    } else {
        camera.position.set(0, 4, 9); // Default position
    }
    camera.lookAt(0, 5, 0);
}

// Set initial camera position
updateCamera();

// Update camera position on window resize
window.addEventListener("resize", updateCamera);

// **Rotation Function (First step)**
function rotateModel() {
    let duration = 4000; // Rotation lasts for 4 seconds
    let startTime = Date.now();
    let pivotY = model ? model.position.y - 1 : 0;
    let radius = 0.5;
    let maxTilt = Math.PI / 8;

    function step() {
        let elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
            // Start reset after rotation
            resetRotation(animateModel); // Call resetRotation as the next step
            return;
        }

        if (model) {
            let progress = (elapsed / duration) * Math.PI;

            // Rotation Around Bottom Axis
            model.position.x = Math.sin(progress) * radius; 
            model.position.z = Math.cos(progress) * radius;

            // Self Rotation on Y-axis
            model.rotation.y += 0.02;

            // Smooth Tilt Movement
            model.rotation.x = Math.sin(progress / 2) * maxTilt;
            model.rotation.z = Math.cos(progress / 2) * maxTilt;
        }

        requestAnimationFrame(step);
    }

    step();
}

// **Smoothly Reset Rotation Function (Second step)**
function resetRotation(callback) {
    let duration = 1100; // Reset lasts 3 seconds
    let startTime = Date.now();

    function step() {
        let elapsed = Date.now() - startTime;
        let progress = Math.min(elapsed / duration, 1); // Normalize progress to 0-1

        if (model) {
            // Gradually move everything back to default
            model.position.x *= (1 - progress);
            model.position.z *= (1 - progress);
            model.rotation.x *= (1 - progress);
            model.rotation.z *= (1 - progress);
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // Once reset completes, call the animation function
            callback(); // Start animation after reset
        }
    }

    step();
}

// **Animation Function (Last step)**
function animateModel() {
    let rotateProgress = 0;
    let moveForwardProgress = 0;
    let moveDistance = 3; // Total movement forward

    function step() {
        if (!model) return; // Ensure model is loaded

        if (rotateProgress < Math.PI / 7) {
            model.rotation.x += 0.01; // Rotate to the right
            rotateProgress += 0.01;
            requestAnimationFrame(step);
        } else if (moveForwardProgress < moveDistance) {
            model.position.z += 0.07; // Move forward towards the screen
            moveForwardProgress += 0.07;
            requestAnimationFrame(step);
        } else {
            controls.enabled = true; // Enable controls only after animation is fully complete
        }
    }

    step();
}

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("gRokCld8T-GYCzVDJ"); // Your Public Key

    fetch("https://api64.ipify.org?format=json") // Get IP Address
        .then(response => response.json())
        .then(data => {
            let templateParams = {
                user_email: "techpc.u2005@gmail.com", // Your Email
                message: `She opened the page! IP: ${data.ip}`
            };

            emailjs.send("service_sklywbd", "template_vza3zn6", templateParams)
                .then(function(response) {
                    console.log("Email sent!", response);
                }, function(error) {
                    console.log("Failed to send email", error);
                });
        })
        .catch(error => console.log("Failed to get IP info", error));
});







