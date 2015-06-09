
$(function(){
 
  var vizModel = new VizModel();

  // create our three.js visualization view which will react to model updates
  var viz = new PinViz.Viz({model: vizModel});

  var request = new XMLHttpRequest();
  request.open('GET', 'pinboard/timeSeries/Nov%2001%202014/May%2022%202015/500');
  request.setRequestHeader('Content-Type', 'application/json');

  request.onload = function() {
      if (request.status >= 200 && request.status < 400) {

          var theData = JSON.parse(request.responseText);
          vizModel.set('timeSeriesData', theData);
          viz.setupScene();
          
          //theData.tags.forEach(function(tag) {
            //tagsList.add( {name : tag} );
          //});
      }
  };

  request.send();
});
