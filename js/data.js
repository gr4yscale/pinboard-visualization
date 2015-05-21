var theData = [];

var xhr = new XMLHttpRequest();
xhr.open('GET', '/timeSeries');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
    if (xhr.status === 200) {
        theData = JSON.parse(xhr.responseText);
        ee.emitEvent('dataLoaded');
    }
};