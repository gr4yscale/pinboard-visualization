params = new function() {
	this.opacity = 0.25;
	this.width = 4.0;
	this.height = 1.75;
	this.boxThickness = 1.0;
	this.hueRange = 0.35;
	this.hueOffset = 0.41;
	this.twistSpeed = 0.15;
	this.rotationSpeed = 0.01;
	this.lightYPosition = 1100;
	this.pause = false;
};

function addParamsGUI(controlObject) {
	var gui = new dat.GUI();
	gui.add(controlObject, 'opacity', 0.1, 1);
	gui.add(controlObject, 'width', 0.001, 10);
	gui.add(controlObject, 'height', 0.02, 3).step(0.01);
	gui.add(controlObject, 'boxThickness', 0.01, 10);
	gui.add(controlObject, 'hueRange', 0.0, 1);
	gui.add(controlObject, 'hueOffset', 0, 1).step(0.01);
	gui.add(controlObject, 'twistSpeed', 0.0, 0.8);
	gui.add(controlObject, 'rotationSpeed', 0.0, 0.1).step(0.01);
	gui.add(controlObject, 'lightYPosition', 0.01, 1200);
	gui.add(controlObject, 'pause');
}