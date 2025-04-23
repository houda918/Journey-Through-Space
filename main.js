//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128/build/three.module.js';

// Get the canvas
const canvas = document.getElementById("solar");


// Ensure the canvas exists before using it
if (!canvas) {
    console.error("Canvas element with ID 'solar' not found!");
}

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Controls for user interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 0.5); // Lumière douce sur toute la scène
light.position.set(0, 0, 0);
scene.add(light);


// Create the Sun
const sunTexture = new THREE.TextureLoader().load('assests/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);



// Planets data
const planets = [
    { name: "Mercury", size: 0.5, texture: "assests/mercury.jpg", distance: 8, speed: 0.02, missions: "Mariner 10, Messenger",atmosphere: "None", moons: 0 },
    { name: "Venus", size: 1, texture: "assests/venus.jpg", distance: 12, speed: 0.015, missions: "Venera, Magellan",atmosphere: "Carbon Dioxide, Nitrogen", moons: 0 },
    { name: "Earth", size: 1.2, texture: "assests/earth.jpg", distance: 16, speed: 0.01, missions: "Apollo, ISS", atmosphere: "Nitrogen, Oxygen", moons: 1 },
    { name: "Mars", size: 0.8, texture: "assests/mars.jpg", distance: 20, speed: 0.008, missions: "Curiosity, Perseverance" , atmosphere: "Carbon Dioxide, Nitrogen", moons: 2},
    { name: "Jupiter", size: 2.5, texture: "assests/jupiter.jpg", distance: 25, speed: 0.005, missions: "Voyager, Juno",atmosphere: "Hydrogen, Helium",moons: 95 },
    { name: "Saturn", size: 2, texture: "assests/saturn.jpg", distance: 30, speed: 0.004, missions: "Cassini, Pioneer 11" ,atmosphere: "Hydrogen, Helium",moons: 146 },
    { name: "Uranus", size: 1.5, texture: "assests/uranus.jpg", distance: 35, speed: 0.003, missions: "Voyager 2" ,atmosphere: "Hydrogen, Helium, Methan",moons: 27},
    { name: "Neptune", size: 1.5, texture: "assests/neptune.jpg", distance: 40, speed: 0.002, missions: "Voyager 2" ,atmosphere: "Hydrogen, Helium, Methan",moons: 14}
];

const planetMeshes = [];

// Create planets and place them in circular orbits
planets.forEach((planet, i) => {
    const texture = new THREE.TextureLoader().load(planet.texture);
    const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);

    // Position planets in circular orbit
    const angle = i * (Math.PI / 4); // Spread planets evenly
    mesh.position.set(
        planet.distance * Math.cos(angle),  // X coordinate
        planet.distance * Math.sin(angle),  // Y coordinate
        0 // Keep them on the same Z-plane
    );

    mesh.userData = planet; // Store planet details
    scene.add(mesh);
    planetMeshes.push(mesh);
});

// Position the camera
camera.position.set(0, 0, 50);


//animation
function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera);
}
animate();


// Click event listener
window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetMeshes);
    
    if (intersects.length > 0) {
        const planet = intersects[0].object;
        const planetData = planets.find(p => p.name === planet.userData.name);

        if (planetData) {
            document.getElementById('info').innerHTML = `
                <strong>Planet:</strong> ${planetData.name} <br>
                <strong>Size:</strong> ${planetData.size} Earth diameters <br>
                <strong>Distance from Sun:</strong> ${planetData.distance} million km <br>
                <strong>Atmosphere:</strong> ${planetData.atmosphere} <br>
                <strong>Number of Moons:</strong> ${planetData.moons} <br>
                <strong>Missions:</strong> ${planetData.missions}
            `;
        }
    }
});


