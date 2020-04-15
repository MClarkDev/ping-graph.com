//
// WS Ping Charting
//

var ws;
var reconnect = true;
var t0 = 0;

document.wsping = {
	times : [],
	data : []
};

connect();
setInterval(ping, 2500);

function connect() {
	var host = window.location.host;
	var uri = "ws://" + host + "/ping/";
	ws = new WebSocket(uri);
}

ws.onopen = function() {
};

ws.onmessage = function(data) {
	pong();
};

ws.onclose = function() {
	if (reconnect) {
		connect();
	}
};

ws.onerror = function(err) {
	console.log("Error: " + err);
};

function ping() {
	t0 = Date.now();
	ws.send("ping");
}

function pong() {

	var t1 = Date.now();
	var ping = (t1 - t0);

	document.getElementById("wsping").innerHTML = ("" + ping + "ms");

	document.wsping.times.push(t1);
	document.wsping.data.push(ping);
	updateGraph();
}

function updateGraph() {

	var times = document.wsping.times;
	var data = document.wsping.data;

	var labels = [];
	for (x = 0; x < times.length; x++) {

		labels.push(getTimeStamp(times[x]));
	}

	document.chart.data.labels = labels;
	document.chart.data.datasets[0].data = data;
	document.chart.update();
}
