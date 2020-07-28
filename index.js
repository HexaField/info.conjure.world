
import * as THREE from 'https://unpkg.com/three@0.118.3/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://unpkg.com/three@0.118.3/examples/jsm/loaders/FBXLoader.js';

var container, stats, controls;
var camera, scene, renderer, light;

var clock = new THREE.Clock();

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 10, 10, 10 );
    camera.lookAt(0,0,0)
    camera.fov = 80;
    camera.near = 0.1;
    camera.far = 2000; 

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.FogExp2( 0x000000, 0.01);

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    var d = 8.25;
    var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    scene.add(dirLight);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 0.0);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.outline = 'none'; // required
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.zIndex = -1; // required
    container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    var delta = clock.getDelta();
    renderer.render( scene, camera );

}