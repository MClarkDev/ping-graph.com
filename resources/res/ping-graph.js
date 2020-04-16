//
// ping-graph.js
// Using web-sockets to draw ping graphs!
//

// Initialize main chart
function initCharting() {

	var ctx = document.getElementById("chart-wsping").getContext('2d');

	var chartData = {
		datasets : [ {
			label : "Ping",
			fill : true,
			lineTension : 0.1,
			backgroundColor : "rgba(75,192,192,0.4)",
			borderColor : "rgba(75,192,192,1)",
			borderCapStyle : 'butt',
			borderDashOffset : 0.0,
			borderJoinStyle : 'miter',
			pointBorderColor : "rgba(75,192,192,1)",
			pointBackgroundColor : "#fff",
			pointBorderWidth : 0,
			pointRadius : 0,
			pointHitRadius : 10,
			data : []
		}, {
			label : "Avg",
			fill : false,
			lineTension : 0,
			backgroundColor : "rgba(75,30,30,0.4)",
			borderColor : "rgba(75,20,20,.75)",
			borderCapStyle : 'butt',
			borderDashOffset : 0.0,
			borderJoinStyle : 'miter',
			pointBorderColor : "rgba(75,192,192,1)",
			pointBackgroundColor : "#fff",
			pointBorderWidth : 0,
			pointRadius : 0,
			pointHitRadius : 5,
			data : []
		} ]
	};

	var chartOptions = {
		responsive : true,
		maintainAspectRatio : true,
		scales : {
			yAxes : [ {
				ticks : {
					beginAtZero : true,
					suggestedMax : 20,
					autoSkip : true,
					maxTicksLimit : 20,
					fontSize : 16,
					callback : function(label, index, labels) {
						return label + ' ms';
					}
				}
			} ],
			xAxes : [ {
				type : 'realtime',
				realtime : {
					duration : 15000
				},
				ticks : {
					fontSize : 16
				}
			} ]
		},
		title : {
			display : false
		},
		legend : {
			display : false
		},
		tooltips : {
			mode : 'index',
			intersect : false,
			titleFontSize : 25,
			bodyFontSize : 20
		},
		hover : {
			mode : 'nearest',
			intersect : false
		},
		plugins : {
			streaming : {
				frameRate : 30
			}
		}
	};

	document.chart = new Chart(ctx, {
		type : "line",
		data : chartData,
		options : chartOptions
	});
}

function updateChart() {

	document.chart.update({
		preservation : true
	});
}

//
// WS Ping Charting
//

var ws;
var reconnect = true;
var t0 = 0;
var pingTask;
document.wstime = {};

connect();

function init() {

	initCharting();

	clearData();
	updateInterval();
}

function getInterval() {

	return document.getElementById("interval").value;
}

function updateInterval() {

	document.chart.options.scales.xAxes[0].realtime.delay = getInterval();
	updateChart();

	clearInterval(pingTask);

	pingTask = setInterval(ping, getInterval());
}

function connect() {

	var host = window.location.host;
	var uri = "ws://" + host + "/ping/";
	ws = new WebSocket(uri);
}

ws.onopen = function() {
	ping();
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

	// push ping to data array
	document.chart.config.data.datasets[0].data.push({
		x : t1,
		y : ping
	});

	// calculate the average over 10s
	var avg = 0;
	var numSamples = 10000 / getInterval();
	var numAvail = document.chart.config.data.datasets[0].data.length;
	if (numAvail < numSamples) {
		numSamples = numAvail;
	}
	for (var i = (numAvail - 1); i >= (numAvail - numSamples); i--) {
		avg += document.chart.config.data.datasets[0].data[i].y;
	}
	avg /= numSamples;
	document.wstime.avg = avg;

	// push avg to data array
	document.chart.config.data.datasets[1].data.push({
		x : t1,
		y : avg
	});

	// render chart
	updateChart();

	// update ui elements
	updateUI();
}

setInterval(updateTimescale, 10000);
function updateTimescale() {

	var duration = (Date.now() - document.wstime.start);
	var buff = 15000 - duration;
	if (buff > 0) {
		duration += buff;
	}

	document.chart.options.scales.xAxes[0].realtime.duration = duration;
	updateChart();
}

function updateUI() {

	document.getElementById("wsping").innerHTML = document.wstime.now;
	document.getElementById("wsavg").innerHTML = document.wstime.avg;

	document.getElementById("wsmin").innerHTML = document.wstime.min;
	document.getElementById("wsmax").innerHTML = document.wstime.max;

	// document.getElementById("wsjitt").innerHTML = document.wstime.now;
}

function clearData() {

	document.wstime.start = Date.now();
	document.wstime.now = 0;
	document.wstime.min = 1000;
	document.wstime.max = 0;
	document.wstime.avg = 0;

	document.chart.config.data.datasets[0].data = [];
	document.chart.config.data.datasets[1].data = [];
	updateChart();
}

function exportData() {

	// const jsonStr = JSON.stringify(document.chart.config.data.datasets);

	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,'
			+ encodeURIComponent(jsonStr));
	element.setAttribute('download', "export.json");

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
