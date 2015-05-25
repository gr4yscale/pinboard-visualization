var camera, scene, renderer, spotlight, controls, data, sampleCount, tagCount, zScale, xScale, xOffset;

function initThree(theData) {

	data = theData;

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.x = -159;
	camera.position.y = -49;
	camera.position.z = 157;
	camera.rotation.x = -0.08246939570769404;
	camera.rotation.y = -0.6113956566440716;
	camera.rotation.z = -0.047410390316570454;

	// making the assumption this is already included in the index.html scripts, should use a module loader like RequireJS here!
	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;

	// global variables for world (fix later)

	sampleCount = 180;
	tagCount = 20; //use data["tags"].length for number of tags in future
	zScale = 6.0;
	xScale = 2.0;
	xOffset = -200;

	createPlot();
	setupAxisLines();
	setupLights();

	// render

	renderer = new THREE.WebGLRenderer( {antialias : true} );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	document.body.appendChild( renderer.domElement );
}

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	// console.log('pos: ' + camera.position.x + ' ' + camera.position.y + ' ' + camera.position.z + '| rotation: ' + camera.rotation.x + ' ' + camera.rotation.y + ' ' + camera.rotation.z)
}

function createPlot() {

	for (j = 1; j < tagCount; j++) {

		var pts = [];

	    for (i = 1; i < sampleCount - 1; i++) { // hardcoding sample count for now
	    	var postCount = data["timeSeries"][i][j];
	    	pts.push(new THREE.Vector3((i * xScale) + xOffset, postCount, (j * zScale))); // silly magic numbers to position scene correctly. fix later.
	    }

	    var spline =  new THREE.SplineCurve3( pts );

		var extrudeSettings = {
			steps			: 2000,
			bevelEnabled	: false,
			extrudePath		: spline
		};

		var rectShape = rectangleShape(zScale, 0.5);
		var geometry = new THREE.ExtrudeGeometry( rectShape, extrudeSettings );
		var material = new THREE.MeshLambertMaterial( { wireframe: false} );

		var hue = (j / 10.0);
		material.color.setHSL(hue, 0.8, 0.5);

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

function setupAxisLines() {

	var lineMaterial = new THREE.LineBasicMaterial({
		color: 0x888888,
	});

    for (i = 0; i < sampleCount - 1; i++) {

    	// yy
		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( (i * xScale) + xOffset, 0, 0 ),
			new THREE.Vector3( (i * xScale) + xOffset, sampleCount, 0 )
		);
		scene.add( new THREE.Line( geometry, lineMaterial) );

		// yx
		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( xOffset, i, 0 ),
			new THREE.Vector3( 160, i, 0 )
		);
		scene.add( new THREE.Line( geometry, lineMaterial) );

		// z
		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( (i * xScale) + xOffset, 0, 0 ),
			new THREE.Vector3( (i * xScale) + xOffset, 0, tagCount * zScale ) // 120 derived from 20 * 6 (tagCount 20, 6 being the scale)
		);
		scene.add( new THREE.Line( geometry, lineMaterial) );
    }

    // zx
	for (j = 0; j < tagCount; j++) {
		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( xOffset, 0, j * zScale ),
			new THREE.Vector3( 160, 0, j * zScale )
		);
		scene.add( new THREE.Line( geometry, lineMaterial) );
	}
}

function setupLights() {

    var directionalLightAbove = new THREE.DirectionalLight("#ffffff");
    directionalLightAbove.position.set(0, 1000, 600);
    directionalLightAbove.castShadow = true;
    directionalLightAbove.shadowCameraNear = 2;
    directionalLightAbove.shadowCameraFar = 2000;
    directionalLightAbove.shadowCameraLeft = -2000;
    directionalLightAbove.shadowCameraRight = 2000;
    directionalLightAbove.shadowCameraTop = 2000;
    directionalLightAbove.shadowCameraBottom = -2000;

    directionalLightAbove.distance = 0;
    directionalLightAbove.intensity = 1.9;
    directionalLightAbove.shadowMapHeight = 1024;
    directionalLightAbove.shadowMapWidth = 1024;

    var directionalLightUnderneath = new THREE.DirectionalLight("#ffffff");
    directionalLightUnderneath.position.set(0, -1000, 300);
    directionalLightUnderneath.castShadow = true;
    directionalLightUnderneath.shadowCameraNear = 2;
    directionalLightUnderneath.shadowCameraFar = 2000;
    directionalLightUnderneath.shadowCameraLeft = -2000;
    directionalLightUnderneath.shadowCameraRight = 2000;
    directionalLightUnderneath.shadowCameraTop = 2000;
    directionalLightUnderneath.shadowCameraBottom = -2000;

    directionalLightUnderneath.distance = 0;
    directionalLightUnderneath.intensity = 0.8;
    directionalLightUnderneath.shadowMapHeight = 1024;
    directionalLightUnderneath.shadowMapWidth = 1024;

    scene.add(directionalLightAbove);
    scene.add(directionalLightUnderneath);
}