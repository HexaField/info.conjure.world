
import * as THREE from 'https://unpkg.com/three@0.118.3/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://unpkg.com/three@0.118.3/examples/jsm/loaders/FBXLoader.js';

var container, stats, controls;
var camera, scene, renderer, light;
var menger;
var objects = [];

var clock = new THREE.Clock();
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

init();
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.set( 0, 0, 2000 );
    // camera.lookAt(0,0,0)
    camera.fov = 80;
    camera.near = 0.1;
    camera.far = 2000; 

    scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xa0a0a0 );
    // scene.fog = new THREE.FogExp2( 0x000000, 0.001);

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    var colour1 = new THREE.Color(0x2685ff)
    var colour2 = new THREE.Color(0x1E6ACC)
    var colour3 = new THREE.Color(0x1855A3)
    var mat1 = new THREE.MeshBasicMaterial( {
        color: colour1,
        side: THREE.DoubleSide
    } );

    var loader = new THREE.FontLoader();
    loader.load( 'assets/helvetiker.json', function ( font ) {
        var xMid, text;
        var message = "COMING SOON";
        var shapes = font.generateShapes( message, 100 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 250, 0 );
        text = new THREE.Mesh( geometry, mat1 );
        scene.add( text );
    })

    var texture = new THREE.TextureLoader().load( 'assets/twitter.png' );
    var twitter = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshBasicMaterial( { map: texture }));
    scene.add(twitter);
    twitter.userData = {URL: "https://twitter.com/conjureworld"};
    twitter.position.set(-200, -200, 0);
    objects.push(twitter);

    var texture = new THREE.TextureLoader().load( 'assets/kofi.png' );
    var kofi = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshBasicMaterial( { transparent:true, map: texture }));
    scene.add(kofi);
    kofi.userData = {URL: "https://ko-fi.com/joshfield"};
    kofi.position.set(200, -200, 0);
    objects.push(kofi);

    menger =  new THREE.Mesh(
        createMengerGeometry(2), 
        
        new THREE.MeshNormalMaterial()
    );
    menger.position.set(0, 0, 0);
    menger.scale.set(200, 200, 200);
    scene.add(menger);
}

function onWindowResize() {

    renderer.domElement.width  = window.innerWidth;
    renderer.domElement.height = window.innerHeight;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height= '100%';

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function animate() {

    requestAnimationFrame( animate );

    var delta = clock.getDelta();

    menger.rotation.x += 0.002
    menger.rotation.y += 0.002

	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( objects );
    
    for(var obj of objects) {
        obj.scale.set(1, 1, 1)
    }
    if (intersects.length > 0) {
        intersects[0].object.scale.set(1.2, 1.2, 1.2);
    }

    renderer.render( scene, camera );

}


function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


function onMouseDown(event) {
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        window.open(intersects[0].object.userData.URL);
    }
}


function createSingleMenger(iteration, totalIterations)
{
    var geometry = new THREE.Geometry();
    for(var x = -1; x <= 1; x++) {
        for(var y = -1; y <= 1; y++) {
            for(var z = -1; z <= 1; z++) {
                if((!x && !y) || (!y && !z) || (!x && !z)) {
                    continue;
                }
                else {
                    var cube = new THREE.Mesh(iteration ? createSingleMenger(iteration - 1, totalIterations) : new THREE.BoxGeometry());
                    cube.scale.set(1/3, 1/3, 1/3);
                    cube.position.set(x/3, y/3, z/3);
                    cube.updateMatrix();
                    geometry.mergeMesh(cube);
                }
            }
        }    
    }
    return geometry;
}

function createMengerGeometry(iterations)
{
    var bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.fromGeometry(createSingleMenger(iterations, iterations));
    return bufferGeometry;
}