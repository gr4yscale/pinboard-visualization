define({

  startDate : 'Jan%2001%202015',
  endDate : 'Mar%2028%202015',
  numTags : 40,
  cumulatie : 'false',
  interval : 7,

  fetchData : function fetchData(cb) {
    var request = new XMLHttpRequest();
    request.open('GET', 'pinboard/timeSeries/' + this.startDate + '/' + this.endDate + '/' + this.numTags + '/' + this.cumulative + '/' + this.interval);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var theData;
            try {
              theData = JSON.parse(request.responseText);
              cb(null, theData);
            }
            catch(err) {
              cb(err, null);
            }
        } else {
          cb(new Error('request failed'), null);
        }
    };

    request.send();
  }
});
