define([
  'underscore',
  'backbone',
], function(_, Backbone){

  var VizModel = Backbone.Model.extend({
    defaults: {
      timeSeriesData : null,
      shouldReloadScene : false,
      sampleCount : 200,
      daysPerInterval : 1,
      tagCount : 40, //use data["tags"].length for number of tags in future
      zScale : 4.0,
      xScale : 1.0,
      xOffset : -(200 / 2),
      xMax : (200 - 1),
      yMax : 160,
      zMax : (40 - 1) * 4.0
    }
  });

  return VizModel;
});
