//
// Geiger Utils
//

function getStamp(time) {

	return getDateStamp(time) + " " + getTimeStamp(time);
}

function getDateStamp(time) {

	var date = new Date(time);

	var month = addZero(date.getMonth());
	var day = addZero(date.getDate());

	return month + "/" + day;
}

function getTimeStamp(time) {

	var date = new Date(time);

	var hours = addZero(date.getHours());
	var minutes = addZero(date.getMinutes());

	return hours + ":" + minutes;
}

function addZero(num) {

	return ("0" + num).slice(-2);
}

function reduce(arr, skip) {

	var res = [];
	for (x = 0; x < arr.length; x += skip) {

		var cnt = 0;
		for (y = x; y < (x + skip); y++) {
			cnt += arr[y];
		}
		var avg = cnt / skip;
		res.push(avg);
	}
	return res;
}

function skip(arr, skip) {

	var res = [];
	for (x = 0; x < arr.length; x++) {
		if (x % skip == 0) {
			res[x] = arr[x];
		} else {
			res[x] = "";
		}
	}
	return res;
}
