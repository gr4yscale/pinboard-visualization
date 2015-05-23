var camera, scene, renderer, spotlight, controls, cubes = [], numCubes, lastDayIndex = 1, data;

function initThree(theData) {

	data = theData;

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.y = 130;
	camera.position.z = 130;

	camera.lookAt(scene.position);

	// making the assumption this is already included in the index.html scripts, should use a module loader like RequireJS here!
	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;

	// world

	numCubes = data["tags"].length;

	for ( i = 1; i < numCubes; i ++ ) {
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff, opacity: 0.25, transparent: true } );

		var geometry = new THREE.BoxGeometry( 1, 0.10, 1 );
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

	if (params.pause === false) {
		lastDayIndex += 0.2;
		if (lastDayIndex > data["dayCount"]) lastDayIndex = data["dayCount"];
	}

	for (var i = (numCubes - 1); i > 0; i-- ) {

		var cube = cubes[i-1];

		var width = data["timeSeries"][Math.floor(lastDayIndex)][i]; // be lame and use an arbitrary day from time series dataset for now

		cube.scale.x = width * params.width;
		cube.scale.z = width * params.width;
		cube.scale.y = params.boxThickness;

		cube.position.y = params.height * i;
		cube.rotation.y = i * 0.1;

		var hue = (i / numCubes) * params.hueRange - params.hueOffset;
		cube.material.color.setHSL(hue, 1.0, 0.5);
		cube.material.opacity = params.opacity;
	}

	spotLight.position.set( 0, params.lightYPosition, 0);

	renderer.render( scene, camera );
}