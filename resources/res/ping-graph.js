//
// Initialize Charting
//

function initCharting() {

	var ctx = document.getElementById("chart-realtime").getContext('2d');

	var chartConfig = {
		datasets : [ {
			fill : true,
			lineTension : 0.1,
			backgroundColor : "rgba(75,192,192,0.4)",
			borderColor : "rgba(75,192,192,1)",
			borderCapStyle : 'butt',
			borderDashOffset : 0.0,
			borderJoinStyle : 'miter',
			pointBorderColor : "rgba(75,192,192,1)",
			pointBackgroundColor : "#fff",
			pointBorderWidth : 1,
			pointRadius : 1,
			pointHitRadius : 10,
			spanGaps : false,
		} ]
	};

	options = {
		responsive : true,
		maintainAspectRatio : true,
		scales : {
			yAxes : [ {
				ticks : {
					beginAtZero : true,
					suggestedMax : 25,
					autoSkip : true,
					maxTicksLimit : 20,
					fontSize : 16,
					callback : function(label, index, labels) {
						return label + ' ms';
					}
				}
			} ],
			xAxes : [ {
				ticks : {
					autoSkip : true,
					maxTicksLimit : 20,
					fontSize : 18
				}
			} ]
		},
		title : {
			display : false,
		},
		legend : {
			display : false
		},
		tooltips : {
			titleFontSize : 25,
			bodyFontSize : 20
		}
	};

	document.chart = new Chart(ctx, {
		type : "line",
		data : chartConfig,
		options : options
	});
}

//
// WS Ping Charting
//

var ws;
var reconnect = true;
var t0 = 0;
var pingTask;
var samples = 10;

document.wsping = {
	time : [],
	data : []
};

document.wstime = {
	now : 0,
	min : 1000,
	max : 0,
	avg : 0,
	lst : []
};

connect();

function init() {

	initCharting();
	updateInterval();
}

function updateInterval() {

	var interval = document.getElementById("interval").value;

	clearInterval(pingTask);

	pingTask = setInterval(ping, interval);
}

function connect() {
	var host = window.location.host;
	var uri = "ws://" + host + "/ping/";
	ws = new WebSocket(uri);
}

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
	ws.send("ping");
	t0 = Date.now();
}

function pong() {

	var t1 = Date.now();
	var ping = (t1 - t0);

	document.wstime.now = ping;

	// update minimum
	if (ping < document.wstime.min) {
		document.wstime.min = ping;
	}

	// update maximum
	if (ping > document.wstime.max) {
		document.wstime.max = ping;
	}

	// keep last 10 in a buffer
	document.wstime.lst.push(ping);
	if (document.wstime.lst.length > 10) {
		document.wstime.lst.pop();
	}

	// calculate the average
	var avg = 0;
	for (var x = 0; x < samples; x++) {
		avg += document.wstime.lst[x];
	}
	document.wstime.avg = (avg / samples);

	// push to data array
	document.wsping.time.push(t1);
	document.wsping.data.push(ping);

	// update ui elements
	updateUI();
	updateGraph();
}

function updateUI() {

	document.getElementById("wsping").innerHTML = document.wstime.now;
	document.getElementById("wsavg").innerHTML = document.wstime.avg;

	document.getElementById("wsmin").innerHTML = document.wstime.min;
	document.getElementById("wsmax").innerHTML = document.wstime.max;

	// document.getElementById("wsjitt").innerHTML = document.wstime.now;
}

function updateGraph() {

	var time = document.wsping.time;
	var data = document.wsping.data;

	var labels = [];
	for (x = 0; x < time.length; x++) {

		labels.push(getTimeStamp(time[x]));
	}

	document.chart.data.labels = labels;
	document.chart.data.datasets[0].data = data;
	document.chart.update();
}

function clearData() {
	
}

function exportData() {

	const jsonStr = JSON.stringify(document.wsping);

	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,'
			+ encodeURIComponent(jsonStr));
	element.setAttribute('download', "export.json");

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
