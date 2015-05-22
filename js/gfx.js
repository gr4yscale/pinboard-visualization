var camera, scene, renderer, spotlight, controls, cubes = [], numCubes;

function initThree(theData) {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.y = 24;
	camera.position.z = 24;
	camera.lookAt(scene.position);

	// making the assumption this is already included in the index.html scripts, should use a module loader like RequireJS here!
	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;

	// world

	numCubes = theData["tags"].length;

	var lastDayIndex = theData["dayCount"];

	for ( i = 1; i < numCubes; i ++ ) {
		var width = theData["timeSeries"][lastDayIndex][i]; // be lame and use an arbitrary day from time series dataset for now
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, opacity: 0.25, transparent: true } );

		var geometry = new THREE.BoxGeometry( width, 0.10, width );
		var cube = new THREE.Mesh( geometry, material );
		
		cube.position.y = 0.2 * i;
		
		scene.add(cube);
		cubes.push(cube);
	}

	// lights

	spotLight = new THREE.SpotLight( 0xffffff, 2.0, -2.5 );
	spotLight.castShadow = true;
	scene.add(spotLight);

	// render

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
}

function render() {
	requestAnimationFrame( render );

	var time = Date.now() * 0.0010;

	for (var i = (numCubes - 1); i > 0; i-- ) {
		var cube = cubes[i-1];
		cube.rotation.y += ((Math.sin(time) * (i/numCubes) * params.twistSpeed) - params.rotationSpeed * 0.5);

		cube.scale.x = params.width;
		cube.scale.z = params.width;
		cube.scale.y = params.boxThickness;

		cube.position.y = params.height * i;
	
		var hue = (i / numCubes) * params.hueRange - params.hueOffset;
		cube.material.color.setHSL(hue, 1.0, 0.5);
		cube.material.opacity = params.opacity;
	}

	spotLight.position.set( 0, params.lightYPosition, 0);

	renderer.render( scene, camera );
}