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
					fontSize : 20
				}
			} ],
			xAxes : [ {
				ticks : {
					fontSize : 20
				}
			} ]
		},
		title : {
			display : true,
			text : 'Ping',
			fontSize : 30
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
