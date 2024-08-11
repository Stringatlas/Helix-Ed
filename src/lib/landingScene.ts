import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let planet: THREE.Mesh, orbitPath: THREE.Line;
let trail: THREE.Points;
let trailPositions: Float32Array;
let trailColors: Float32Array;
let trailIndex = 0;
const trailLength = 50;

export function createScene(canvas: HTMLCanvasElement) {
    init(canvas);
    animate();
}

function init(canvas: HTMLCanvasElement) {
    // Create scene
    scene = new THREE.Scene();

    // Set up camera
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
 
    camera.position.x = -25.504867875851385;
    camera.position.y = 50.00000825313451;
    camera.position.z = -9.88059142242705;



    camera.rotation.x = -1.570795328740428;
    camera.rotation.y = -6.305693928815308e-8;
    camera.rotation.z = -0.06309599354191674;

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Create the larger sphere (e.g., the Sun)
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create the smaller sphere (e.g., the Planet)
    const planetGeometry = new THREE.SphereGeometry(2, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planet);

    // Create the orbit path using a gray line
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        new THREE.Path().absarc(0, 0, 20, 0, Math.PI * 2).getSpacedPoints(50)
    );

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
    orbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitPath.rotation.x = Math.PI / 2; // Rotate to be horizontal
    scene.add(orbitPath);

    // Set up the trail
    const trailGeometry = new THREE.BufferGeometry();
    trailPositions = new Float32Array(trailLength * 3); // 3 vertices per point
    trailColors = new Float32Array(trailLength * 3); // RGB per point
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    const trailMaterial = new THREE.PointsMaterial({ vertexColors: true, size: 0.5 });
    
    trail = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trail);

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });

      const controls = new OrbitControls(camera, canvas);

}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the planet around the Sun
    const time = Date.now() * 0.001;
    planet.position.x = Math.cos(time) * 20;
    planet.position.z = Math.sin(time) * 20;

    // Update the trail
    trailPositions[trailIndex * 3] = planet.position.x;
    trailPositions[trailIndex * 3 + 1] = planet.position.y;
    trailPositions[trailIndex * 3 + 2] = planet.position.z;

    for (let i = 0; i < trailLength; i++) {
        let fadeFactor;

        if (trailIndex < i) {
            fadeFactor = (trailLength + trailIndex - i) / trailLength;
        }
        else {
            fadeFactor = (trailIndex - i) / trailLength;
        }

        // js mod function broken for negative numbers
        // let fadeFactor = ((trailIndex - i) % 51) / trailLength;

        trailColors[i * 3] = 1 - fadeFactor * 0.5; // Red channel fades to 0 (gray)
        trailColors[i * 3 + 1] = 1 - fadeFactor * 0.5; // Green channel fades to 0 (gray)
        trailColors[i * 3 + 2] = 1 - fadeFactor * 0.5; // Blue channel fades to 0 (gray)
    }

    trailIndex = (trailIndex + 1) % trailLength;

    trail.geometry.attributes.position.needsUpdate = true;
    trail.geometry.attributes.color.needsUpdate = true;

    // Render the scene
    renderer.render(scene, camera);
}

