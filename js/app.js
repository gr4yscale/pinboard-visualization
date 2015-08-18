define([
  'underscore',
  'api_client',
  'models/VizModel',
  'viz',
  'views/OverlayView',
  'controllers/TagSelectionController'
], function(_, ApiClient, VizModel, Viz, OverlayView, TagSelectionController){

  var init = function() {
  
    var vizModel = new VizModel();

    var viz = new Viz({model: vizModel});

    var overlayView = new OverlayView();

    ApiClient.fetchData(function(error, theData) {

      var sampleCount = theData.sampleCount;
      var xOffset = -(sampleCount / 2);
      var xMax = vizModel.get('xScale') * sampleCount;
      var tagCount = theData.tags.length;
      var zMax = (tagCount - 1) * vizModel.get('zScale');

      vizModel.set('timeSeriesData', theData);
      vizModel.set('sampleCount', sampleCount);
      vizModel.set('xOffset', xOffset);
      vizModel.set('xMax', xMax);
      vizModel.set('tagCount', tagCount);
      vizModel.set('zMax', zMax);
      vizModel.set('daysPerInterval', theData.daysPerInterval);

      viz.setupScene();

      var possibleTags = _.map(theData.tags, function(tag) {
        return { name : tag };
      });

      TagSelectionController.setPossibleTags(possibleTags);
    });
  };

  return {
    init : init
  };
});
