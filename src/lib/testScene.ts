import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Mesh, Object3D, Scene, Vector3 } from 'three';
import { browser } from '$app/environment';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const loader = new GLTFLoader();
const snowScatterBoxSize = 200;
const numberOfSnow = 300;
const snowStartingHeight = 50;
const groundHeight = -1;
const scene = new Three.Scene();
let camera: Three.PerspectiveCamera;

interface LoadModel {
    path: string,
    instances: number,
    positions: Array<Vector3>,
    scale: Array<Vector3>,
    rotation?: Array<Vector3>,
}

function* generateRandomPosition(count: number, xSpread: number, zSpread: number) {
    for (let i=0; i < count; i++) {
        yield new Vector3(Three.MathUtils.randFloatSpread(xSpread), 0, Three.MathUtils.randFloatSpread(zSpread));
    }
}

function *generateRandomScale(count: number, xMax: number, xMin: number, yMax: number, yMin: number, zMin: number, zMax: number){
    for (let i=0; i < count; i++) {
        yield new Vector3(Three.MathUtils.randFloat(xMin, xMax), Three.MathUtils.randFloat(yMin, yMax), Three.MathUtils.randFloat(zMin, zMax));
    } 
}

const numTrees = 75;

const treeGenerator = generateRandomPosition(numTrees, 125, 75);
const treeScaleGenerator = generateRandomScale(numTrees, 1, 1.2, 1, 1.5, 1, 1.2);

const needLoadModels: Array<LoadModel> = [
    {
        path: "/snowy_christmas_tree.glb",
        instances: numTrees,
        positions: [new Vector3(-14, 0, -56), ...treeGenerator],
        scale: [...treeScaleGenerator],
        rotation: undefined,
    },
    {
        path: "/christmas_tree.glb",
        instances: 1,
        positions: [new Vector3(browser ? window.innerWidth * 0.003 : 0, 0, -50)],
        scale: [new Vector3(0.04, 0.04, 0.04)],
        rotation: [new Vector3(0, Math.PI + 0.3, 0)]
    },
    {
        path: "/less.glb",
        instances: 1, 
        positions: [new Vector3(-20, 0, -30)],
        scale: [new Vector3(2, 2, 2)],
        rotation: [new Vector3(0, Math.PI / -6, 0)]
    }
]

const loadedModels: Array<Object3D> = new Array<Object3D>();

async function loadModels(scene: Three.Scene) {
    for (const model of needLoadModels) {
        loader.loadAsync(model.path).then(gltf => {
            const loadedModel = gltf.scene;
            const positions = model.positions;

            for (let i=0; i < model.instances; i++) {
                const copyModel = loadedModel.clone();

                if (model.rotation) {
                    copyModel.setRotationFromEuler(new Three.Euler(model.rotation[0].x, model.rotation[0].y, model.rotation[0].z, "XYZ"));
                }
                else {
                    copyModel.rotateY(Three.MathUtils.randFloatSpread(Math.PI/2));
                }

                copyModel.position.set(positions[i].x, positions[i].y, positions[i].z);
                copyModel.scale.set(model.scale[i].x, model.scale[i].y, model.scale[i].z);
                scene.add(copyModel);
                loadedModels.push(copyModel);
            }
        })
    }
}

function createSnow(scene: Three.Scene) {
    let x, y, z;
    if (Math.random() < 0.5) {
        x = Three.MathUtils.randFloatSpread(snowScatterBoxSize);
        z = Three.MathUtils.randFloat(-snowScatterBoxSize + 110, snowScatterBoxSize-30);
        y = Three.MathUtils.randFloat(groundHeight, snowStartingHeight);
    }
    else {
        x = Three.MathUtils.randFloatSpread(snowScatterBoxSize-100);
        z = Three.MathUtils.randFloat(-snowScatterBoxSize + 100, snowScatterBoxSize-150);
        y = Three.MathUtils.randFloat(groundHeight, snowStartingHeight);
    }

    const geo = new Three.SphereGeometry(0.3, 3, 3);
    const mat = new Three.MeshStandardMaterial( {emissive: 0xffffff, color: 0xffffff, emissiveIntensity: 1});
    const snowflake = new Three.Mesh(geo, mat);
    snowflake.position.set(x, y, z);
    scene.add(snowflake);
  
    return snowflake;
}

export async function createScene(canvas: HTMLCanvasElement) {
    const clock = new Three.Clock();

    camera = new Three.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(-7.479148750844475, 7.096112336518934, -86.97987646412219);
    camera.rotation.set(-3.0712172829862143, 0.0047898017225396355, 3.1412550132263717, "XYZ")

    const renderer = new Three.WebGLRenderer({ canvas: canvas, antialias: true});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const light = new Three.AmbientLight(0xffffff, 0.4);
    const directionalLight = new Three.DirectionalLight(0xB8DCE6, 0.5);
    directionalLight.castShadow = true;
    directionalLight.position.set(10, 25, 25);
    scene.fog = new Three.Fog(0x829FC0, 15, 130);
    scene.add(directionalLight);
    scene.add(light);

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);


    const controls = new OrbitControls(camera, canvas);
    loadModels(scene);
    
    const areaLight = new Three.SpotLight(0xD9CD5F, 1, 50, Math.PI / 6, 0.5);
    areaLight.target.position.x = browser ? window.innerWidth * 0.003 : 0;
    areaLight.target.position.y = 0;
    areaLight.target.position.z = -50;

    areaLight.position.set(browser ? window.innerWidth * 0.003 : 0, 25, -50);
    scene.add(areaLight);
    const spotlighthelper = new Three.SpotLightHelper(areaLight);   // eslint-disable-line @typescript-eslint/no-unused-vars


    resize();
    const snow = Array(numberOfSnow).fill(0).map(() => createSnow(scene));

    
    const groundGeo = new Three.PlaneGeometry(snowScatterBoxSize + 150, snowScatterBoxSize);
    const groundMat = new Three.MeshToonMaterial({
        color: 0xffffff
    });
    const ground = new Mesh(groundGeo, groundMat);
    ground.rotateX(-Math.PI / 2);
    scene.add(ground);

    const animate = () => {
        const deltaTime = clock.getDelta();    // eslint-disable-line @typescript-eslint/no-unused-vars

        // console.log("Scene polycount:", renderer.info.render.triangles)
        // console.log("Active Drawcalls:", renderer.info.render.calls)
        // console.log("Textures in Memory", renderer.info.memory.textures)
        // console.log("Geometries in Memory", renderer.info.memory.geometries)
        // console.log("fps", 1/ deltaTime)
        // console.log("---------------")

        snow.forEach(s => {
            s.position.y -= 0.3;
            if (s.position.y < groundHeight) {
                let x, z;
                if (Math.random() < 0.5) {
                    x = Three.MathUtils.randFloatSpread(snowScatterBoxSize);
                    z = Three.MathUtils.randFloat(-snowScatterBoxSize + 110, snowScatterBoxSize-30);
                }
                else {
                    x = Three.MathUtils.randFloatSpread(snowScatterBoxSize-100);
                    z = Three.MathUtils.randFloat(-snowScatterBoxSize + 100, snowScatterBoxSize-150);
                }
                s.position.set(x, snowStartingHeight, z);
            }   
        });

        if (canvas.height !== canvas.clientHeight || canvas.width !== canvas.clientWidth) {
            resize();
        }

        // controls.update();
        composer.render();
        requestAnimationFrame(animate);
    };
    
    animate();

    function resize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }

    window.addEventListener('resize', resize);
}
