define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
      
  var Viz = Backbone.View.extend({

    el: '#viz',
    initialize : function() {
      _.bindAll(this, 'render', 'setupScene', '_resetSceneIfNeeded', '_animate', '_setupPlotGeometry', '_setupLights', '_setupAxisLines', '_setupXYAxisText', '_onDocumentMouseMove');
      this.tagMeshes = [];
      this.axisLines = [];
      this.axisTextMeshes = [];
      this.mouse = new THREE.Vector2();
      this.raycaster = new THREE.Raycaster();

      document.addEventListener( 'mousemove', this._onDocumentMouseMove, false );

      this.render();
    },

    render : function() {
    
      this.scene = new THREE.Scene(); 
  
      this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 10000 );
      this.camera.position.x = 0;
      this.camera.position.y = 20;
      this.camera.position.z = 157;
      this.camera.rotation.x = -0.68246939570769404;
      this.camera.rotation.y = -0.613956566440716;
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

    _onDocumentMouseMove : function(event) {

      event.preventDefault();

      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },

    setupScene : function() {
      
      this._setupLights();
      this._setupPlotGeometry();
      this._setupAxisLines();
      //this._setupXYAxisText();
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

      this.raycaster.setFromCamera(this.mouse, this.camera);

      var intersects = this.raycaster.intersectObjects(this.tagMeshes);

      if (intersects.length > 0) {
        // only update if we're intersecting a new object
        if (this.intersected != intersects[0].object) {
          this.intersected = intersects[0].object;
          this.intersected.material.emissive.setHex(0xffffff);
        } else {
          this.intersected = null;
        }
      }

      this.renderer.render(this.scene, this.camera);
    },

    _setupPlotGeometry : function() {
      
      var splineCurve3 =  new THREE.SplineCurve3();
      var rectShape = this._rectangleShape(this.model.get('zScale'), 0.25);
      var x, y, z;

      for (j = 1; j < this.model.get('tagCount'); j++) {

        var pts = [];

        for (i = 0; i < this.model.get('sampleCount'); i = i + this.model.get('daysPerInterval')) {
          x = (i * this.model.get('xScale')) + this.model.get('xOffset');
          y = this.model.get('timeSeriesData').timeSeries[i][j] * 3.0;
          z = (j * this.model.get('zScale') - (this.model.get('zMax') / 2.0));
          pts.push(new THREE.Vector3(x, y, z));
        }

        splineCurve3.points = pts;

        var extrudeSettings = {
          steps			: 1200,
          bevelEnabled	: false,
          extrudePath		: splineCurve3
        };

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
        var xMax = this.model.get('xMax');
        var yMax = this.model.get('yMax');
        var zMax = this.model.get('zMax');
        var xOffset = this.model.get('xOffset');

        // confusingly, x for the camera and lights is what i consider to be z on the graph...
        directionalLightAbove.position.set(-xMax * 6.0, yMax * 10.0, zMax * 4.0);
        directionalLightAbove.castShadow = true;
        directionalLightAbove.shadowCameraNear = 1;
        directionalLightAbove.shadowCameraFar = xMax * 10.0;
        directionalLightAbove.shadowCameraLeft = -zMax / 2.0;
        directionalLightAbove.shadowCameraRight = zMax / 2.0;
        directionalLightAbove.shadowCameraTop = xMax / 2.0;
        directionalLightAbove.shadowCameraBottom = -xMax / 2.0;

        directionalLightAbove.distance = 0;
        directionalLightAbove.intensity = 1.0;
        directionalLightAbove.shadowMapHeight = 1024;
        directionalLightAbove.shadowMapWidth = 1024;


        directionalLightAbove.shadowCameraVisible = false;
        
        var directionalLightUnderneath = new THREE.DirectionalLight("#ffffff");
        directionalLightUnderneath.position.set(0, -yMax, 0);
        directionalLightUnderneath.castShadow = false;
        directionalLightUnderneath.shadowCameraNear = 1;
        directionalLightUnderneath.shadowCameraFar = yMax * 2.0;
        directionalLightUnderneath.shadowCameraLeft = -zMax / 2.0;
        directionalLightUnderneath.shadowCameraRight = zMax / 2.0;
        directionalLightUnderneath.shadowCameraTop = xMax / 2.0;
        directionalLightUnderneath.shadowCameraBottom = -xMax / 2.0;

        directionalLightUnderneath.distance = 0;
        directionalLightUnderneath.intensity = 0.4;
        directionalLightUnderneath.shadowMapHeight = 1024;
        directionalLightUnderneath.shadowMapWidth = 1024;

        directionalLightUnderneath.shadowCameraVisible = false;

        this.scene.add( directionalLightAbove );
        this.scene.add( directionalLightUnderneath );
    },

    _setupAxisLines : function() {

        // refactor this method later
        var sampleCount = this.model.get('sampleCount');
        var tagCount = this.model.get('tagCount');
        var xOffset = this.model.get('xOffset');
        var xScale = this.model.get('xScale');
        var zScale = this.model.get('zScale');
        var xMax = this.model.get('xMax');
        var yMax = this.model.get('yMax');
        var zMax = this.model.get('zMax');

        var lineMaterial = new THREE.LineBasicMaterial({
          color: 0x888888,
        });

        var bufferGeometryXY = new THREE.BufferGeometry();
        var bufferGeometryXZ = new THREE.BufferGeometry();
        var bufferGeometryYX = new THREE.BufferGeometry();
        var bufferGeometryYZ = new THREE.BufferGeometry();
        var bufferGeometryZX = new THREE.BufferGeometry();
        var bufferGeometryZY = new THREE.BufferGeometry();
        var verticesXY = new Float32Array( sampleCount * 6 );
        var verticesXZ = new Float32Array( sampleCount * 6 );
        var verticesYX = new Float32Array( yMax * 6 );
        var verticesYZ = new Float32Array( yMax * 6 );
        var verticesZX = new Float32Array( tagCount * 6 );
        var verticesZY = new Float32Array( tagCount * 6 );

        for (x = 0; x < sampleCount; x++) {

          // xy plane
          verticesXY[x*6] = (x * xScale) + xOffset; // we multiply by 6 because we have 2 points for each line with 3 components per point
          verticesXY[x*6+1] = 0;
          verticesXY[x*6+2] = -(zMax / 2.0);
          verticesXY[x*6+3] = (x * xScale) + xOffset;
          verticesXY[x*6+4] = yMax;
          verticesXY[x*6+5] = -(zMax / 2.0);

          // xz plane
          verticesXZ[x*6] = (x * xScale) + xOffset;
          verticesXZ[x*6+1] = 0;
          verticesXZ[x*6+2] = -(zMax / 2.0);
          verticesXZ[x*6+3] = (x * xScale) + xOffset;
          verticesXZ[x*6+4] = 0;
          verticesXZ[x*6+5] = zMax / 2.0;
        }

        for (y = 0; y < yMax; y++) {

          // yx plane
          verticesYX[y*6] = xOffset;
          verticesYX[y*6+1] = y;
          verticesYX[y*6+2] = -(zMax / 2.0);
          verticesYX[y*6+3] = xMax + xOffset;
          verticesYX[y*6+4] = y;
          verticesYX[y*6+5] = -(zMax / 2.0);

          // yz plane
          verticesYZ[y*6] = xMax + xOffset;
          verticesYZ[y*6+1] = y;
          verticesYZ[y*6+2] = -(zMax / 2.0);
          verticesYZ[y*6+3] = xMax + xOffset;
          verticesYZ[y*6+4] = y;
          verticesYZ[y*6+5] = zMax / 2.0;
        }

        for (zx = 0; zx < tagCount; zx++) {

          // zx plane
          verticesZX[zx*6] = xOffset;
          verticesZX[zx*6+1] = 0;
          verticesZX[zx*6+2] = (zx * zScale) / 2.0;
          verticesZX[zx*6+3] = xOffset + xMax;
          verticesZX[zx*6+4] = 0;
          verticesZX[zx*6+5] = (zx * zScale) / 2.0;

          // zy plane
          verticesZY[zx*6] = xOffset + xMax;
          verticesZY[zx*6+1] = 0;
          verticesZY[zx*6+2] = (zx * zScale) / 2.0;
          verticesZY[zx*6+3] = xOffset + xMax;
          verticesZY[zx*6+4] = yMax;
          verticesZY[zx*6+5] = (zx * zScale) / 2.0;
        }
          
        bufferGeometryXY.addAttribute( 'position', new THREE.BufferAttribute( verticesXY, 3 ) ); // 3 components per vertice (take 3 chunks from the array at a time)
        bufferGeometryXZ.addAttribute( 'position', new THREE.BufferAttribute( verticesXZ, 3 ) );
        bufferGeometryYX.addAttribute( 'position', new THREE.BufferAttribute( verticesYX, 3 ) ); // 3 components per vertice (take 3 chunks from the array at a time)
        bufferGeometryYZ.addAttribute( 'position', new THREE.BufferAttribute( verticesYZ, 3 ) );
        bufferGeometryZX.addAttribute( 'position', new THREE.BufferAttribute( verticesZX, 3 ) ); // 3 components per vertice (take 3 chunks from the array at a time)
        bufferGeometryZY.addAttribute( 'position', new THREE.BufferAttribute( verticesZY, 3 ) );
        
        var lineXY = new THREE.Line( bufferGeometryXY, lineMaterial, THREE.LinePieces );
        var lineXZ = new THREE.Line( bufferGeometryXZ, lineMaterial, THREE.LinePieces );
        var lineYX = new THREE.Line( bufferGeometryYX, lineMaterial, THREE.LinePieces );
        var lineYZ = new THREE.Line( bufferGeometryYZ, lineMaterial, THREE.LinePieces );
        var lineZX = new THREE.Line( bufferGeometryZX, lineMaterial, THREE.LinePieces );
        var lineZY = new THREE.Line( bufferGeometryZY, lineMaterial, THREE.LinePieces );
        
        this.scene.add(lineXY);
        this.scene.add(lineXZ);
        this.scene.add(lineYX);
        this.scene.add(lineYZ);
        this.scene.add(lineZX);
        this.scene.add(lineZY);
        this.axisLines.push(lineXY);
        this.axisLines.push(lineXZ);
        this.axisLines.push(lineYX);
        this.axisLines.push(lineYZ);
        this.axisLines.push(lineZX);
        this.axisLines.push(lineZY);
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

  return Viz;
});
