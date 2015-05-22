var ee = new EventEmitter();

addParamsGUI(params);

function setup(theData) {
	initThree(theData);
	render();
}

ee.on('dataLoaded', setup);