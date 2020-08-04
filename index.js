
import * as THREE from 'https://unpkg.com/three@0.118.3/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://unpkg.com/three@0.118.3/examples/jsm/loaders/FBXLoader.js';

var container, stats, controls;
var camera, scene, renderer, light;
var mengers, light1, light2, light3, light4;
var objects = [];
var mengerDepth, mengersCount;

var clock = new THREE.Clock();
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

init();
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('touchend', onTouchEnd, false);
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
    scene.fog = new THREE.FogExp2( 0x000000, 0.0001);

    function createSpotlight( color ) {

        var newObj = new THREE.SpotLight( color, 2 );

        newObj.castShadow = true;
        newObj.angle = 1;
        newObj.penumbra = 0.4;
        newObj.decay = 1;
        newObj.distance = 3000;
        newObj.target = scene;
        newObj.intensity = 0.2

        return newObj;

    }

    light1 = createSpotlight( 0xff0040 );
    scene.add( light1 );

    light2 = createSpotlight( 0x0040ff);
    scene.add( light2 );

    light3 = createSpotlight( 0x80ff80 );
    scene.add( light3 );

    light4 = createSpotlight( 0xffaa00 );
    scene.add( light4 );

    light = new THREE.PointLight( 0x1855A3, 2, 5000 );
    light.position.set(0, 0, 1000)
    scene.add( light );

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
    var mat1 = new THREE.MeshPhysicalMaterial( {
        color: colour1,
        side: THREE.DoubleSide
    } );


    function text(message, font) {
        var xMid, text;
        var geometry = new THREE.TextBufferGeometry( message, {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
        } );
        geometry.computeBoundingBox();
        xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        geometry.translate( xMid, 0, 0 );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhysicalMaterial( { color: 0xffffff} ));
        return mesh;
    }

    var loader = new THREE.FontLoader();
    loader.load( 'assets/helvetiker.json', function ( font ) {

        var text1 = text("COMING SOON", font);
        var group1 = new THREE.Group();
        group1.position.set(0, 300, 0 );
        group1.add(text1);
        scene.add( group1 );
        
        var text2 = text("Try out the prototype!", font);
        text2.scale.set(0.25, 0.25, 0.25);
        
        var group2 = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 50), new THREE.MeshBasicMaterial( { transparent:true, side:THREE.DoubleSide, transparent: true, opacity:0}));
        group2.add(text2)
        group2.position.set(0, -450, 0 );
        group2.userData = {URL: "https://conjure.world"};
        scene.add(group2);
        objects.push(group2);

        var text3 = text("Learn more!", font);
        text3.scale.set(0.25, 0.25, 0.25);
        
        var group3 = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 50), new THREE.MeshBasicMaterial( { transparent:true, side:THREE.DoubleSide, transparent: true, opacity:0}));
        group3.add(text3);
        group3.position.set(0, -525, 0 );
        group3.userData = {URL: "https://devpost.com/software/conjure-ujk4al"};
        scene.add(group3);
        objects.push(group3);
    })

    var texture = new THREE.TextureLoader().load( 'assets/twitter.png' );
    var twitter = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshBasicMaterial( { transparent:true, side:THREE.DoubleSide, map: texture}));
    scene.add(twitter);
    twitter.userData = {URL: "https://twitter.com/conjureworld"};
    twitter.position.set(-350, -300, 0);
    objects.push(twitter);

    var texture = new THREE.TextureLoader().load( 'assets/yt.png' );
    var yt = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshBasicMaterial( { transparent:true, side:THREE.DoubleSide, map: texture }));
    scene.add(yt);
    yt.userData = {URL: "https://www.youtube.com/channel/UCZ-gYU_8R-EEFzVY09UyVDQ"};
    yt.position.set(0, -300, 0);
    objects.push(yt);

    var texture = new THREE.TextureLoader().load( 'assets/kofi.png' );
    var kofi = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), new THREE.MeshBasicMaterial( { transparent:true, side:THREE.DoubleSide, map: texture }));
    scene.add(kofi);
    kofi.userData = {URL: "https://ko-fi.com/joshfield"};
    kofi.position.set(350, -300, 0);
    objects.push(kofi);

    mengerDepth = 0;
    mengers = [];
    mengersCount = 3;
    var mengerMat = new THREE.MeshPhysicalMaterial( {
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        reflectivity: 0
    } );
    var cube = new THREE.Mesh(new THREE.BoxBufferGeometry(200,200,200), mengerMat)
    cube.visible = false;
    scene.add(cube);
    mengers.push(cube);
    // objects.push(cube);
    for(var i = 0; i < mengersCount; i ++)
    {
        var mengerMesh = new THREE.Mesh(createMengerGeometry(i), mengerMat)
        mengerMesh.scale.set(200, 200, 200);
        var menger = new THREE.Group()
        menger.add(mengerMesh)
        menger.visible = false;
        scene.add(menger);
        mengers.push(menger);
        // objects.push(menger);
    } 
    mengers[mengerDepth].visible = true;
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

    var time = Date.now() * 0.0005;
    var delta = clock.getDelta();


    for(var menger of mengers)
    {
        menger.rotation.x += 0.002
        menger.rotation.y += 0.002
    }

    light1.position.x = Math.sin( time * 0.7 ) * -1000;
    light1.position.y = Math.cos( time * 0.5 ) * 1000;
    light1.position.z = Math.cos( time * 0.3 ) * 1000;

    light2.position.x = Math.cos( time * 0.3 ) * 1000;
    light2.position.y = Math.sin( time * 0.5 ) * 1000;
    light2.position.z = Math.sin( time * 0.7 ) * -1000;

    light3.position.x = Math.sin( time * 0.7 ) * -1000;
    light3.position.y = Math.cos( time * 0.3 ) * 1000;
    light3.position.z = Math.sin( time * 0.5 ) * 1000;

    light4.position.x = Math.sin( time * 0.3 ) * 1000;
    light4.position.y = Math.cos( time * 0.7 ) * -1000;
    light4.position.z = Math.sin( time * 0.5 ) * -1000;

	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects(objects , false);
    
    for(var obj of objects) {
        obj.scale.set(1, 1, 1)
    }
    if (intersects.length > 0) {
        intersects[0].object.scale.set(1.2, 1.2, 1.2);
    }
    renderer.render( scene, camera );

}


function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onTouchEnd(event) {
	mouse.x = ( e.touches[0].clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.touches[0].clientY / window.innerHeight ) * 2 + 1;
    intersects();
}

function onMouseDown(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    intersects();
}
function intersects() {
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        if(intersects[0].object.userData.URL)
            window.open(intersects[0].object.userData.URL);
    }
	intersects = raycaster.intersectObjects(mengers, true);
    if (intersects.length > 0)
    {
        console.log(mengerDepth)
        console.log(mengers[mengerDepth])
        mengers[mengerDepth].visible = false;
        mengerDepth++;
        if(mengerDepth >= mengers.length) 
        {
            mengerDepth = 0;
        }
        mengers[mengerDepth].visible = true;
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