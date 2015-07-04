define([
  'models/VizModel',
  'viz',
  'views/OverlayView'
], function(VizModel, Viz, OverlayView){

  var init = function() {
  
    var vizModel = new VizModel();

    var viz = new Viz({model: vizModel});

    var overlayView = new OverlayView();

    var request = new XMLHttpRequest();
    request.open('GET', 'pinboard/timeSeries/Jan%2001%202015/Jun%2028%202015/30/false/7');
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {

            var theData = JSON.parse(request.responseText);
            var sampleCount = theData['sampleCount'];
            var xOffset = -(sampleCount / 2);
            var xMax = vizModel.get('xScale') * sampleCount;
            var tagCount = theData['tags'].length;
            var zMax = (tagCount - 1) * vizModel.get('zScale');

            vizModel.set('timeSeriesData', theData);
            vizModel.set('sampleCount', theData['sampleCount']);
            vizModel.set('xOffset', xOffset);
            vizModel.set('xMax', xMax);
            vizModel.set('tagCount', tagCount);
            vizModel.set('zMax', zMax);
            vizModel.set('daysPerInterval', theData['daysPerInterval']);

            viz.setupScene();
            
            //theData.tags.forEach(function(tag) {
              //tagsList.add( {name : tag} );
            //});
        }
    };

    request.send();
  };

  return {
    init : init
  };
});
