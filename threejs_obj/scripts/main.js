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


var currentScene;


/* Scene1 */
var scene1 = {
	position:{
		x : 0,
		y: -5,
		z: 22
	},
	target:{
		x: 0,
		y: 0,
		z: 0
	}
}

var scene2 = {
	position:{
		x : 0,
		y: -1.8,
		z: 1
	},
	target:{
		x: 0,
		y: -1.8,
		z: 0
	}
}

var scene3 = {
	position:{
		x : 0,
		y: 12,
		z: 1
	},
	target:{
		x: 0,
		y: 12,
		z: 4.2
	}
}



$(document).ready(function(){
	init();
	animate();

	timeout = setTimeout(function(){
		startAutoRotation();
	}, 10000);

});


init = function () {
	/* Assigning webgl container to container variable */	
	container = $(".webgl-container").get(0);
	/* Initializing camera to initial position  */
	camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.01, 400 );
	/* Initializing controls */
	controls = new THREE.TrackballControls( camera );
	controls.maxDistance = scene1.position.z; //We lock the max zoom distance to the initial camera position

	/* Settings initial camera position with scene1 settings */	
	currentScene = scene1;	
	controls.object.position.x = currentScene.position.x;	
	controls.object.position.y = currentScene.position.y;	
	controls.object.position.z = currentScene.position.z;

	/* Initializing scene */
	scene = new THREE.Scene();
	/* Initializing lights */
	init_lights();
	/* Initializing loadmanager */
	init_loadmanager();	
	init_files();


	
	$(".webgl-container").on("touchstart", function(){
		stopAutoRotation();
	}).on("touchend", function(){
		stopAutoRotation();
		timeout = setTimeout(function(){
			gotoScene();
		}, 10000);
	});

	$(".action1").on("touchend", function(){
		currentScene = scene1;	
		stopAutoRotation();
		scene1_effects();
		gotoScene();	

	});

	$(".action2").on("touchend", function(){
		currentScene = scene2;	
		stopAutoRotation();
		scene2_effects();
		gotoScene();	

	});

	$(".action3").on("touchend", function(){
		currentScene = scene3;	
		stopAutoRotation();
		scene3_effects();
		gotoScene();

	});
	
	hammertime = new Hammer(container);
    hammertime.on("press", function(ev) {		
		idle = false;
		clearTimeout(timeout);
		console.log("press")

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
	camera.lookAt( currentScene.position );
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
	texture_loader.load( 'textures/intestine.jpg', function ( image ) {
		texture.image = image;
		texture.needsUpdate = true;
		obj_loader.load( 'obj/intestine.obj', function ( object ) {
			intestine_obj = object
			intestine_obj.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material.map = texture;
					child.material.side = THREE.DoubleSide;	
					child.material.transparent = true	
					child.material.opacity = 1;
				}			
			});
			scene.add( intestine_obj );
			obj_loader.load( 'obj/molecule_1.obj', function ( object ) {
				molecule1_obj = object;
				object.position.y = scene2.position.y;
				molecule1_obj.traverse( function ( child ) {
					if ( child instanceof THREE.Mesh ) {
						//child.material.map = texture;
						child.scale.set(0.05,0.05,0.05);
						child.material.color.setRGB(255,255,255);	
						child.material.emissive.setHex(0x0000ff);	
						child.material.ambient.setHex(0x0000ff);
					}
				});
				scene.add( molecule1_obj );
				obj_loader.load( 'obj/molecule_2.obj', function ( object ) {
					molecule2_obj = object;
					object.position.y = scene3.position.y;
					object.position.z = 4.2;
					molecule2_obj.traverse( function ( child ) {
						if ( child instanceof THREE.Mesh ) {
							//child.material.map = texture;
							child.scale.set(0.05,0.05,0.05);
							child.material.color.setRGB(255,255,255);	
							child.material.emissive.setHex(0x0000ff);	
							child.material.ambient.setHex(0xff00ff);
						}
					});
					scene.add( molecule2_obj );
				}, onProgress, onError );
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
	console.log(controls)
	tween = new TWEEN.Tween(controls.object.position).to({ x: controls.position0.x, y: controls.position0.y, z: controls.position0.z }, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	tween2 = new TWEEN.Tween(controls.target).to({ x: controls.target0.x, y: controls.target0.y, z: controls.target0.z }, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	tween2 = new TWEEN.Tween(camera.position).to({ y: -5, z: 22 }, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	tween3 = new TWEEN.Tween(controls.object.up).to({ x: controls.up0.x, y: controls.up0.y, z: controls.up0.z }, 2000 ).onComplete(function(){
		idle = true;
		//controls.reset();
	}).easing(TWEEN.Easing.Exponential.InOut).start();
}

autoRotateCamera = function(time){
 	if(idle){
 		controls.object.position.x = Math.sin( (timer-time) * 0.0001 ) * currentScene.position.z;
  		controls.object.position.z = Math.cos( (timer-time) * 0.0001 ) * currentScene.position.z;
 	}else{
 		timer = time
 	}
}

gotoScene = function (){
	tween = new TWEEN.Tween(controls.object.position).to({ x: currentScene.position.x, y: currentScene.position.y, z: currentScene.position.z }, 2500 ).easing(TWEEN.Easing.Exponential.InOut).start();
	tween2 = new TWEEN.Tween(controls.target).to({ x: currentScene.target.x, y: currentScene.target.y, z: currentScene.target.z }, 2500 ).easing(TWEEN.Easing.Exponential.InOut).start();
	tween3 = new TWEEN.Tween(controls.object.up).to({ x: 0, y: 1, z: 0 }, 2500 ).onComplete(function(){
		setTimeout(function(){
			startAutoRotation();
		}, 0)

	}).easing(TWEEN.Easing.Exponential.InOut).start();
}

startAutoRotation = function(){
	idle = true;
}

setAutorotation = function(){
}

stopAutoRotation = function(){			
	idle = false;
	clearTimeout(timeout);
}

scene1_effects = function(){
	intestine_obj.traverse( function( node ) {
	    if( node.material ) {
	        node.material.transparent = true;
			new TWEEN.Tween( node.material ).to( { opacity: 1 }, 1000 ).start()
	    }
	});
}

scene2_effects = function(){
	intestine_obj.traverse( function( node ) {
	    if( node.material ) {
	        node.material.transparent = true;
			new TWEEN.Tween( node.material ).to( { opacity: 0.10 }, 1000 ).start().onComplete(function(){
				new TWEEN.Tween( node.material ).to( { opacity: 1 }, 1500 ).delay(2000).start();
			});
	    }
	});
}


scene3_effects = function(){
	intestine_obj.traverse( function( node ) {
	    if( node.material ) {
	        node.material.transparent = true;
			new TWEEN.Tween( node.material ).to( { opacity: 0.10 }, 1000 ).start()
	    }
	});
}






