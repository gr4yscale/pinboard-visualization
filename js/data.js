var request = new XMLHttpRequest();
request.open('GET', '/pinboard/timeSeries');
request.setRequestHeader('Content-Type', 'application/json');

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var theData = JSON.parse(request.responseText);
        ee.emitEvent('dataLoaded', [theData]);
    }
};

request.send();