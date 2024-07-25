import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// let container, stats;
let camera, scene, renderer;
let controls, water, sun;
// , mesh;

const loader = new GLTFLoader();
// loader.load('assets/boat/scene.gltf',function(gltf){
//   // console.log(gltf);
//   scene.add(gltf.scene);
//   gltf.scene.scale.set(0.09,0.09,0.09);
//   gltf.scene.position.set(0,1,20);
//   gltf.scene.rotation.set(0,10,0)
// });


///boat 

class Boat {
  constructor(){
    loader.load('assets/boat1/scene.gltf',(gltf)=>{ 
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.09,0.09,0.09);
  gltf.scene.position.set(0,-3,20);
  gltf.scene.rotation.set(0,9.5,0);

  this.boat=gltf.scene;
  this.speed={
 val: 0,
 rot: 0,

  }

});
  }
stop(){
  this.speed.val =0;
  this.speed.rot =0;

}

update(){
  if(this.boat){
    this.boat.rotation.y += this.speed.rot ;
    this.boat.translateZ(this.speed.val);
  }
}    }

const boat =new Boat();


/////city 

class City {
  constructor(){
    loader.load('assets/city/scene.gltf',function(gltf){  
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.1,0.1,0.1);
  gltf.scene.position.set(3,12,2);
  gltf.scene.rotation.set(0,7,0);
gltf.scene.position.y= 9;
  this.city=gltf.scene;
});
  }
// update(){
//   if(this.boat){
//     this.boat.rotation.y +=0.01;
//   }
// }  
  }

const city =new City();



init();
animate();

function init() {

  // container = document.getElementById( 'container' );

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  document.body.appendChild( renderer.domElement );

  //

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.set( 30, 30, 100 );

  //

  sun = new THREE.Vector3();

  // Water

  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = - Math.PI / 2;

  scene.add( water );

  // Skybox

  const sky = new Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );

  const skyUniforms = sky.material.uniforms;

  skyUniforms[ 'turbidity' ].value = 10;
  skyUniforms[ 'rayleigh' ].value = 2;
  skyUniforms[ 'mieCoefficient' ].value = 0.005;
  skyUniforms[ 'mieDirectionalG' ].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180
  };

  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  const sceneEnv = new THREE.Scene();

  let renderTarget;

  function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    if ( renderTarget !== undefined ) renderTarget.dispose();

    sceneEnv.add( sky );
    renderTarget = pmremGenerator.fromScene( sceneEnv );
    scene.add( sky );

    scene.environment = renderTarget.texture;

  }

  updateSun();

  // //

  // const geometry = new THREE.BoxGeometry( 30, 30, 30 );
  // const material = new THREE.MeshStandardMaterial( { roughness: 0 } );

  // mesh = new THREE.Mesh( geometry, material );
  // scene.add( mesh );

  // //

  controls = new OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set( 0, 10, 0 );
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();


  const waterUniforms = water.material.uniforms;

 

  window.addEventListener( 'resize', onWindowResize );

///////////////مشان خلي يستمع للكبسات فوق و تحت و يمين و يسار و كذا 
window.addEventListener( 'keydown' ,function(e){

if(e.key == "ArrowUp"){
  boat.speed.val = 0.9;
}
if(e.key == "ArrowDown"){
  boat.speed.val = -0.9;
}
if(e.key == "ArrowRight"){
  boat.speed.rot = 0.1;
}
if(e.key == "ArrowLeft"){
  boat.speed.rot = -0.1;
}




});

//////////////////////////اذا شلت ايدي عن الزر يتوقف 
window.addEventListener( 'keyup' ,function(e){
 boat.stop();
  
  });



}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );
  render();
  // stats.update();
  boat.update();

}

function render() {

 

  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

  renderer.render( scene, camera );

}