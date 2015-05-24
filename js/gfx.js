var camera, scene, renderer, spotlight, controls, data;

function initThree(theData) {

	data = theData;

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.y = 20;
	camera.position.z = 60;

	camera.lookAt(scene.position);

	// making the assumption this is already included in the index.html scripts, should use a module loader like RequireJS here!
	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;

	// world

	//use data["tags"].length for number of tags in future
	createPlot(20);

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
	spotLight.position.set( 0, params.lightYPosition, 100);
	renderer.render( scene, camera );
}

function createPlot(numTags) {

	for (j = 1; j < numTags; j++) {

		var pts = [];

	    for (i = 1; i < 180 - 1; i++) { // hardcoding sample count for now
	    	var postCount = data["timeSeries"][i][j];
	    	pts.push(new THREE.Vector3((i*4.0) - 400, postCount - 60, (-j * 6))); // silly magic numbers to position scene correctly. fix later.
	    }

	    var spline =  new THREE.SplineCurve3( pts );

		var extrudeSettings = {
			steps			: 6000,
			bevelEnabled	: false,
			extrudePath		: spline
		};

		var rectShape = rectangleShape(6, 0.5);
		var geometry = new THREE.ExtrudeGeometry( rectShape, extrudeSettings );
		var material = new THREE.MeshLambertMaterial( { wireframe: false } );

		var hue = (j / 10.0);
		material.color.setHSL(hue, 1.0, 0.5);
		material.opacity = 0.25;

		var mesh = new THREE.Mesh( geometry, material );
		scene.add(mesh);
	}
}

function rectangleShape(rectLength, rectWidth) {

	var rectShape = new THREE.Shape();
	rectShape.moveTo( 0,0 );
	rectShape.lineTo( 0, rectWidth );
	rectShape.lineTo( rectLength, rectWidth );
	rectShape.lineTo( rectLength, 0 );
	rectShape.lineTo( 0, 0 );

	return rectShape;
}