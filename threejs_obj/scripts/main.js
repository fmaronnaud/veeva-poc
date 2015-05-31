var container;
var camera;
var scene;
var renderer;
var intestine_obj;
var molecule1_obj;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var loadmanager;
var idle = false;
var timer;
var timeout;



$(document).ready(function(){
	init();
	animate();

});


init = function () {
	/* Assigning webgl container to container variable */	
	container = $(".webgl-container").get(0);
	/* Initializing camera to initial position  */
	camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 400 );
	camera.position.z = 22;
	camera.position.y = -5;
	/* Initializing controls */
	controls = new THREE.TrackballControls( camera );
	controls.maxDistance = camera.position.z; //We lock the max zoom distance to the initial camera position
	/* Initializing scene */
	scene = new THREE.Scene();
	/* Initializing lights */
	init_lights();
	/* Initializing loadmanager */
	init_loadmanager();	
	init_files();
	
	
	$(".webgl-container").on("touchstart", function(){		
		idle = false;
		clearTimeout(timeout);
		console.log("start")
	}).on("touchend", function(){
		console.log("end")
		timeout = setTimeout(function(){
			resetCameraY();
		}, 5000);
	});

	$(".action1").on("touchend", function(){		
		idle = false;
		clearTimeout(timeout);
		tween = new TWEEN.Tween(controls.object.position).to({ x: molecule1_obj.position.x, y: molecule1_obj.position.y, z: 1}, 2000 ).start();
		tween2 = new TWEEN.Tween(controls.target).to({ x: molecule1_obj.position.x, y: molecule1_obj.position.y, z: molecule1_obj.position.z }, 2000 ).start();
		tween3 = new TWEEN.Tween(controls.object.up).to({ x: controls.up0.x, y: controls.up0.y, z: controls.up0.z }, 2000 ).onComplete(function(){
			
		}).start();
	});
	
	hammertime = new Hammer(container);
    hammertime.on("press", function(ev) {		
		idle = false;
		clearTimeout(timeout);
		console.log("press")

    });
    hammertime.on("pan", {treshold: 10},function(ev) {		
		idle = false;
		clearTimeout(timeout);
		console.log("pan")

    });

	//

	renderer = new THREE.WebGLRenderer({
	  devicePixelRatio: window.devicePixelRatio
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0xffffff, 1);
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}



onWindowResize = function() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
animate = function(time) {
	requestAnimationFrame( animate );
	autoRotateCamera(time);	
	TWEEN.update();

  

	camera.lookAt( scene.position );
	controls.update();
	render();
}

render = function() {
	renderer.render( scene, camera );
}

init_files = function(){
	texture = new THREE.Texture();
	texture_loader = new THREE.ImageLoader( loadmanager );
	obj_loader = new THREE.OBJLoader( loadmanager );
	texture_loader.load( '../textures/intestine.jpg', function ( image ) {
		texture.image = image;
		texture.needsUpdate = true;
		obj_loader.load( '../obj/intestine.obj', function ( object ) {
			intestine_obj = object
			intestine_obj.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material.map = texture;
					child.material.side = THREE.DoubleSide;	
					child.material.transparent = false	
					child.material.opacity = 0.5;
				}			
			});
			scene.add( intestine_obj );
			obj_loader.load( '../obj/molecule_1.obj', function ( object ) {
				molecule1_obj = object;
				object.position.y = -1.8;
				molecule1_obj.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						//child.material.map = texture;
						child.scale.set(0.05,0.05,0.05);
						child.material.color.setRGB(255,255,255);	
						child.material.emissive.setHex(0x0000ff);	
						child.material.ambient.setHex(0xff00ff);
					}
				});
				scene.add( molecule1_obj );
			}, onProgress, onError );
		}, onProgress, onError );
	}, onProgress, onError);
}



init_lights = function(){
	ambient = new THREE.AmbientLight( 0xffffff );
	scene.add( ambient );
}

init_loadmanager = function(){
	loadmanager = new THREE.LoadingManager();
	loadmanager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};	
}

onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};
onError = function ( xhr ) {};

resetCameraY = function(){
	
	tween = new TWEEN.Tween(controls.object.position).to({ x: controls.position0.x, y: controls.position0.y, z: controls.position0.z }, 2000 ).start();
	tween2 = new TWEEN.Tween(controls.target).to({ x: controls.target0.x, y: controls.target0.y, z: controls.target0.z }, 2000 ).start();
	tween3 = new TWEEN.Tween(controls.object.up).to({ x: controls.up0.x, y: controls.up0.y, z: controls.up0.z }, 2000 ).onComplete(function(){
		idle = true;
	}).start();

}

autoRotateCamera = function(time){
 	if(idle){
 		camera.position.x = Math.sin( (timer-time) * 0.0005 ) * 50
  		camera.position.z = Math.cos( (timer-time) * 0.0005 ) * 50;
 	}else{
 		timer = time
 	}
}
