var PinViz = PinViz || {};

PinViz.Viz = Backbone.View.extend({

  initialize : function() {
    _.bindAll(this, 'render', 'setupScene', '_resetSceneIfNeeded', '_animate', '_setupPlotGeometry', '_setupLights', '_setupAxisLines', '_addLine', '_setupXYAxisText');
    this.tagMeshes = [];
    this.axisLines = [];
    this.axisTextMeshes = [];
  },

  render : function() {

    this.scene = new THREE.Scene(); 
 
    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.x = 50;
    this.camera.position.y = 25;
    this.camera.position.z = 157;
    this.camera.rotation.x = -0.08246939570769404;
    this.camera.rotation.y = -0.6113956566440716;
    this.camera.rotation.z = -0.047410390316570454;

    this.controls = new THREE.OrbitControls( this.camera );
	  this.controls.damping = 0.2;

    this.renderer = new THREE.WebGLRenderer( {antialias : true} );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMapEnabled = true;

    // inject the WebGL renderer dom element into the backbone view 
    this.$el.html(this.renderer.domElement); 

    return this;
  },

  setupScene : function() {

    this._setupLights();
    this._setupPlotGeometry();
    this._setupAxisLines();
    this._setupXYAxisText();
    this._animate();
  },


  _resetSceneIfNeeded : function() {

    if (this.model.get('shouldReloadScene') === true) {
      this.tagMeshes.forEach(function(tagMesh){
        this.scene.remove(tagMesh);
      }, this);

      this.axisLines.forEach(function(axisLine){
        this.scene.remove(axisLine);
      }, this);
      
      this.axisTextMeshes.forEach(function(axisTextMesh){
        this.scene.remove(axisTextMesh);
      }, this);
      this.setupScene();
    }
  },

  _animate : function() {

    this._resetSceneIfNeeded();
    var animate = this._animate;
    requestAnimationFrame(animate);
    this.renderer.render(this.scene, this.camera);
  },

  _setupPlotGeometry : function() {
    
    for (j = 1; j < this.model.get('tagCount'); j++) {

      var pts = [];

      for (i = 0; i < this.model.get('sampleCount'); i++) { 
        var postCount = this.model.get('timeSeriesData').timeSeries[i+1][j];
        pts.push(new THREE.Vector3((i * this.model.get('xScale')) + this.model.get('xOffset'), postCount, (j * this.model.get('zScale')))); // silly magic numbers to position scene correctly. fix later.
      }

      var spline =  new THREE.SplineCurve3( pts );

      var extrudeSettings = {
        steps			: 2000,
        bevelEnabled	: false,
        extrudePath		: spline
      };

      var rectShape = this._rectangleShape(this.model.get('zScale'), 0.25);
      var geometry = new THREE.ExtrudeGeometry( rectShape, extrudeSettings );
      var material = new THREE.MeshLambertMaterial( { wireframe: false} );

      var hue = (j / this.model.get('tagCount'));
      material.color.setHSL(hue, 0.8, 0.5);

      var mesh = new THREE.Mesh( geometry, material );
      this.tagMeshes.push(mesh);
      this.scene.add(mesh);
    }
  },

  _setupLights : function() {

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
      directionalLightAbove.intensity = 1.6;
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
      directionalLightUnderneath.intensity = 0.6;
      directionalLightUnderneath.shadowMapHeight = 1024;
      directionalLightUnderneath.shadowMapWidth = 1024;

      this.scene.add( directionalLightAbove );
      this.scene.add( directionalLightUnderneath );
  },

  _setupAxisLines : function() {

      var sampleCount = this.model.get('sampleCount');
      var tagCount = this.model.get('tagCount');
      var xOffset = this.model.get('xOffset');
      var xScale = this.model.get('xScale');
      var zScale = this.model.get('zScale');
      var xMax = this.model.get('xMax');
      var yMax = this.model.get('yMax');
      var zMax = this.model.get('zMax');

      for (x = 0; x < sampleCount; x++) {

        // xy plane
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
          new THREE.Vector3( (x * xScale) + xOffset, 0, 0 ),
          new THREE.Vector3( (x * xScale) + xOffset, yMax, 0 )
        );
        this._addLine(geometry);

        // xz plane
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
          new THREE.Vector3( (x * xScale) + xOffset, 0, 0 ),
          new THREE.Vector3( (x * xScale) + xOffset, 0, zMax )
        );
        this._addLine(geometry);
      }

      for (y = 0; y < yMax; y++) {

        // yx plane
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
          new THREE.Vector3( xOffset, y, 0 ),
          new THREE.Vector3( xMax + xOffset, y, 0 )
        );
        this._addLine(geometry);

        // yz plane
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
          new THREE.Vector3( xMax + xOffset, y, 0 ),
          new THREE.Vector3( xMax + xOffset, y, zMax )
        );
        this._addLine(geometry);
      }

      for (zx = 0; zx < tagCount; zx++) {

        // zx plane
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
          new THREE.Vector3( xOffset, 0, zx * zScale ),
          new THREE.Vector3( xMax + xOffset, 0, zx * zScale )
        );
        this._addLine(geometry);

        // zy plane
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
          new THREE.Vector3( xMax + xOffset, 0, zx * zScale ),
          new THREE.Vector3( xMax + xOffset, yMax, zx * zScale )
        );
        this._addLine(geometry);
      }
  },

  _addLine : function(geometry) {

      // refactor this to take 2 vectors

      var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x888888,
      });
      
      var line = new THREE.Line( geometry, lineMaterial);
      this.axisLines.push(line);
      this.scene.add(line);
  },

  _setupXYAxisText : function() {

    var rotation = new THREE.Vector3( 0, 0, 0 );

    for (x = 0; x < this.model.get('sampleCount'); x++) {
      var textMesh = this._buildTextMesh(x);
      textMesh.position.x = ((x + 1) * this.model.get('xScale')) + this.model.get('xOffset') - 2;
      textMesh.position.z = this.model.get('zMax') + 1;
      textMesh.rotation.z = -0.5 * Math.PI;
      textMesh.rotation.x = -0.5 * Math.PI;
      this.axisTextMeshes.push(textMesh);
      this.scene.add(textMesh);
    }

    for (y = 0; y < this.model.get('yMax'); y++) {
      var textMesh = this._buildTextMesh(y);
      textMesh.position.x = this.model.get('xOffset') - 2;
      textMesh.position.y = y;
      this.axisTextMeshes.push(textMesh);
      this.scene.add(textMesh);
    }
  },

  _buildTextMesh : function(text) {

    var options = {
      size: 0.8,
      height: 0.03,
      font: "optimer",
      style: 'normal',
      weight: 'bold',
      bevelThickness: 0,
      bevelSize: 0,
      bevelSegments: 0,
      bevelEnabled: false,
      curveSegments: 8,
      steps: 1
    };

    var meshMaterial = new THREE.MeshLambertMaterial( {color: 0x1BACFF } );
    var geometry = new THREE.TextGeometry( text, options );
    var textMesh = new THREE.Mesh( geometry, meshMaterial );

    return textMesh;
  },

  _rectangleShape : function(rectLength, rectWidth) {

    var rectShape = new THREE.Shape();
    rectShape.moveTo( 0,0 );
    rectShape.lineTo( 0, rectWidth );
    rectShape.lineTo( rectLength, rectWidth );
    rectShape.lineTo( rectLength, 0 );
    rectShape.lineTo( 0, 0 );

    return rectShape;
  }
});
