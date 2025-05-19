/*
 ________________________________________________
(                  Nalla Neram                 ()
\-----------------------------------------------\
|                                               |
|   Copyright 2025 ag-sanjjeev                  |
|                                               |
|-----------------------------------------------|
|   The source code is licensed under           |
|   MIT-style License.                          |
|                                               |
|-----------------------------------------------|
|                                               |
|   The usage, permission and condition         |
|   are applicable to this source code          |
|   as per license.                             |
|                                               |
|-----------------------------------------------|
|                                               |
|   That can be found in LICENSE file           |
|   or at https://opensource.org/licenses/MIT.  |
(_______________________________________________(

*/

// Functions

/**
 * Convert mixed unicode characters to proper text
 * @param {string|object} mixedData
 * @returns {string|object}
 */
function convertMixedUnicodeToText(mixedData) {
	if (!mixedData) { return null; } // if any invalid input return null
	let dataType = typeof mixedData;
	if (dataType === 'object') { mixedData = JSON.stringify(mixedData); }
	const unicodePattern = /&#(\d+);/g;
	const convertedString = mixedData.replace(unicodePattern, (match, p1) => String.fromCharCode(p1));
	return (dataType === 'object') ? JSON.parse(convertedString) : convertedString;
}

/**
 * Get Tamil Day for corresponding day
 * @param {integer} dayIndex
 * @param {float} time
 * @returns {string}
 */
function getCorrespondingTamilDay(dayIndex, time) {	
	let hour = Math.floor(time);
	if (hour < 6) { dayIndex -= 1; }
	dayIndex = (dayIndex < 0) ? 6 : dayIndex;
	return convertMixedUnicodeToText(tamilDays[dayIndex]);
}

/**
 * Convert time to decimal
 * @param {string} time
 * @returns {float}
 */
function timeToDecimal(time) {
	const [h, m = 0] = time.split(':').map(Number); // extract hour and minute value
	return parseFloat(h) + parseFloat(m / 60);
}

/**
 * Convert minutes to 24 Hours Time Format
 * @param {integer} time
 * @returns {string}
 */
function minutesTo24HourTimeFormat(time) {
	let hour = Math.floor(time/60) % 24;
	let minutes = time % 60;
	return String(hour).padStart(2, 0) + ':' + String(minutes).padStart(2, 0);
}

/**
 * Convert minutes to 12 Hours Time Format
 * @param {integer} time
 * @returns {string}
 */
function minutesTo12HourTimeFormat(time) {
	let hour24 = Math.floor(time/60) % 24;
	let hour12 = (hour24 % 12 === 0) ? 12 : hour24 % 12; 
	let minutes = time % 60;
	let period = (hour24 >= 6 && hour24 < 18) ? "பகல்" : "இரவு";
	period = convertMixedUnicodeToText(period); // convert mixed unicode to text
	let hourString = String(hour12).padStart(2, 0);
	let minuteString = String(minutes).padStart(2, 0);
	return `${period} ${hourString}:${minuteString}`;
}

/**
 * Get Orai Information for Tamil Day and Time
 * @param {string} dayKey
 * @param {float} time
 * @returns {object | null}
 */
function getOrai(dayKey, time) {
 	let data = convertMixedUnicodeToText(oraiData); // convert mixed unicode to text
 	data = data[dayKey];
 	if (!data) { return null; } // if undefined or not exist then return null
 	let hour = Math.floor(time);
 	let period = (hour >= 6 && hour < 18) ? "பகல்" : "இரவு";
 	period = convertMixedUnicodeToText(period);
 	data = data[period];
 	if (!data) { return null; } // if undefined or not exist then return null

 	// Get timeRange Key by iteration
 	let timeRangeKey = null; 	
 	for (let timeRange in data) {
 		let [timeStart, timeEnd] = timeRange.split('-');
 		let timeStartDecimal = timeToDecimal(timeStart);
 		let timeEndDecimal = timeToDecimal(timeEnd);
 		if (time > 12) { time -= 12; } // convert time to 12 hour format

 		// fall in between and break
 		if (timeStartDecimal > timeEndDecimal) { // Time cycle after 24 hours completed
 			if (timeStartDecimal <= time || timeEndDecimal > time) { timeRangeKey = timeRange; break; }
 		} else if (timeStartDecimal <= time && timeEndDecimal > time) { timeRangeKey = timeRange; break; }
 	}

 	// Get Orai Information and return it
 	data = data[timeRangeKey];
 	return data ? {name: data[0], type: data[1], interval: timeRangeKey} : null;
}

 /**
 * Get Gowri Panchangam Information for Tamil Day and Time
 * @param {string} dayKey
 * @param {float} time
 * @returns {object | null}
 */
function getGowriPanchangam(dayKey, time) {
 	let data = convertMixedUnicodeToText(gowriPanchangamData); // convert mixed unicode to text
 	data = data[dayKey];
 	if (!data) { return null; } // returns null when undefined or not exist
 	let hour = Math.floor(time);
 	let period = (hour >= 6 && hour < 18) ? "பகல்" : "இரவு";
 	period = convertMixedUnicodeToText(period); // convert mixed unicode to text
 	data = data[period];
 	if (!data) { return null; } // returns null when undefined or not exist

 	// Get timeRange Key by iteration
 	let timeRangeKey = null;
 	for (let timeRange in data) {
 		let [timeStart, timeEnd] = timeRange.split('-');
 		let timeStartDecimal = timeToDecimal(timeStart);
 		let timeEndDecimal = timeToDecimal(timeEnd);
 		if (time > 12) { time -= 12; } // convert time to 12 hour format

 		// fall in between and break
 		if (timeStartDecimal > timeEndDecimal) { // Time cycle after 24 hours completed
 			if (timeStartDecimal <= time || timeEndDecimal > time) { timeRangeKey = timeRange; break; }
 		} else if (timeStartDecimal <= time && timeEndDecimal > time) { timeRangeKey = timeRange; break; }
 	}

 	// Get Gowri Panchangam Information and return it
 	data = data[timeRangeKey];
 	return data ? {name: data[0], type: data[1], interval: timeRangeKey} : null;
}

 /**
 * Get Asubha Kaalam Information for Tamil Day and Time
 * @param {string} dayKey
 * @param {float} time
 * @returns {object | null}
 */
function getAsubhaKaalam(dayKey, time) {
 	let data = convertMixedUnicodeToText(asubhaKaalamData); // convert mixed unicode to text
 	data = data[dayKey];
 	if (!data) { return null; } // returns null when undefined or not exist
 	let hour = Math.floor(time);
 	let period = (hour >= 6 && hour < 18) ? "பகல்" : "இரவு";
 	period = convertMixedUnicodeToText(period); // convert mixed unicode to text
 	data = data[period];
 	if (!data) { return null; } // returns null when undefined or not exist

 	// Get timeRange Key by iteration
 	let timeRangeKey = null;
 	for (let timeRange in data) {
 		let [timeStart, timeEnd] = timeRange.split('-');
 		let timeStartDecimal = timeToDecimal(timeStart);
 		let timeEndDecimal = timeToDecimal(timeEnd);
 		if (time > 12) { time -= 12; } // convert time to 12 hour format

 		// fall in between and break
 		if (timeStartDecimal > timeEndDecimal) { // Time cycle after 24 hours completed
 			if (timeStartDecimal <= time || timeEndDecimal > time) { timeRangeKey = timeRange; break; }
 		} else if (timeStartDecimal <= time && timeEndDecimal > time) { timeRangeKey = timeRange; break; }
 	}

 	// Get Asubha Kaalam Information and return it
 	data = data[timeRangeKey];
 	return data ? {name: data[0], type: data[1], interval: timeRangeKey} : null;
}  

 /**
 * Prepare Table for Tamil Day
 * @param {string} dayKey
 * @returns {object}
 */
function prepareTable(dayKey) {
 	let total_TimeSlots = 48; // 48 half an hour exist in a day
 	let period = null; // denotes day or night
 	let totalMinutes = 0; // total minutes for time slot
 	let tStart = 0;
 	let tEnd = 0;
 	let auspiciousTimeSlots = [];

 	// Get Tbody Reference
 	const tbody = document.getElementById('panchangam-tbody');
  tbody.innerHTML = ''; // Clear previous content		

 	let previousOrai = null;
 	let currentOrai = null;
 	let orai_RowSpan = 1;
 	let previousGowriPanchangam = null;
 	let currentGowriPanchangam = null;
 	let gowriPanchangam_RowSpan = 1;
 	let previousAsubhaKaalam = null;
 	let currentAsubhaKaalam = null;
 	let asubhaKaalam_RowSpan = 1;

 	// Variable Initialization for Table preparation
 	let tr = null;
 	let timeStringCell = null;
 	let oraiCell = null;
 	let oraiCellType = null; // whether subham or asubham
 	let gowriPanchangamCell = null;
 	let gowriPanchangamCellType = null; // whether subham or asubham
 	let asubhaKaalamCell = null;
 	let asubhaKaalamCellType = null; // whether subham or asubham

 	// Iterate over total time slots
 	for (var i = 0; i < total_TimeSlots; i++) {
 		totalMinutes = (6 * 60) + (i * 30); // a day starts from 6'O clock in Tamil Calendar System
 		tStart = minutesTo24HourTimeFormat(totalMinutes); // current or starting time slot
 		tEnd = minutesTo24HourTimeFormat(totalMinutes + 30); // next or ending time slot
 		let tStartDecimal = timeToDecimal(tStart);

 		// table elements preparation
 		tr = document.createElement('tr'); // table row
 		
 		// timeString column cells preparation
 		timeStringCell = document.createElement('td');
 		timeStringCell.textContent = `${minutesTo12HourTimeFormat(totalMinutes)}-${minutesTo12HourTimeFormat(totalMinutes + 30)}`;
 		tr.appendChild(timeStringCell);

 		// orai column cells preparation
 		let currentOraiData = getOrai(dayKey, tStartDecimal);
 		currentOrai = currentOraiData.name;
 		oraiCellType = currentOraiData.type;
 		if (previousOrai == null || previousOrai != currentOrai) {
 			oraiCell = document.createElement('td');
 			oraiCell.textContent = currentOrai;
 			oraiCellType == convertMixedUnicodeToText("சுபம்") ? oraiCell.classList.add('subham-cell') : oraiCell.classList.add('asubham-cell');
 			tr.appendChild(oraiCell);
 			previousOrai = currentOrai; 			
 		} else {
 			oraiCell.rowSpan = oraiCell.rowSpan + 1;
 		}

 		// gowri panchangam column cells preparation
 		let currentGowriPanchangamData = getGowriPanchangam(dayKey, tStartDecimal);
 		currentGowriPanchangam = currentGowriPanchangamData.name;
 		gowriPanchangamCellType = currentGowriPanchangamData.type;
 		if (previousGowriPanchangam == null || previousGowriPanchangam != currentGowriPanchangam) {
 			gowriPanchangamCell = document.createElement('td');
 			gowriPanchangamCell.textContent = currentGowriPanchangam;
 			gowriPanchangamCellType == convertMixedUnicodeToText("சுபம்") ? gowriPanchangamCell.classList.add('subham-cell') : gowriPanchangamCell.classList.add('asubham-cell');
 			tr.appendChild(gowriPanchangamCell);
 			previousGowriPanchangam = currentGowriPanchangam; 			
 		} else {
 			gowriPanchangamCell.rowSpan = gowriPanchangamCell.rowSpan + 1;
 		}

 		// asubha kaalam column cells preparation
 		let currentAsubhaKaalamData = getAsubhaKaalam(dayKey, tStartDecimal); 	
 		currentAsubhaKaalam = (currentAsubhaKaalamData == null) ? '-' : currentAsubhaKaalamData.name;
 		if (previousAsubhaKaalam == null || previousAsubhaKaalam != currentAsubhaKaalam) {
 			asubhaKaalamCell = document.createElement('td');
 			asubhaKaalamCell.textContent = currentAsubhaKaalam;
 			asubhaKaalamCellType = (currentAsubhaKaalamData == null) ? convertMixedUnicodeToText("சுபம்") : convertMixedUnicodeToText("அசுபம்");
 			asubhaKaalamCellType == convertMixedUnicodeToText("சுபம்") ? asubhaKaalamCell.classList.add('subham-cell') : asubhaKaalamCell.classList.add('asubham-cell');
 			tr.appendChild(asubhaKaalamCell);
 			previousAsubhaKaalam = currentAsubhaKaalam; 			
 		} else {
 			asubhaKaalamCell.rowSpan = asubhaKaalamCell.rowSpan + 1;
 		}

 		// Append Table Row to Tbody
 		tbody.appendChild(tr);

 		// Auspicious TimeSlots Preparation 		
 		if (oraiCellType == convertMixedUnicodeToText("சுபம்") && gowriPanchangamCellType == convertMixedUnicodeToText("சுபம்") && asubhaKaalamCellType == convertMixedUnicodeToText("சுபம்")) { 			
	 		auspiciousTimeSlots.push({
	 			start: `${minutesTo12HourTimeFormat(totalMinutes)}`,
	 			end: `${minutesTo12HourTimeFormat(totalMinutes + 30)}`,
	 			orai: currentOrai,
	 			gowriPanchangam: currentGowriPanchangam,
	 			asubhaKaalam: currentAsubhaKaalam
	 		});
	 	}
 	}

 	// Returns auspicious time slots
 	return auspiciousTimeSlots;
}

/**
 * Prepare Auspicious time slots from the object
 * @param {object} timeSlots
 * @returns {none}
 */
function prepareAuspiciousTimeSlots(timeSlots) {
 	let auspiciousContainer = document.getElementById('auspicious-times');
 	let auspiciousList = document.getElementById('auspicious-list');
 	auspiciousList.innerHTML = ''; // clear previous list

 	// Iterate over all time slots available
 	for (let slot of timeSlots) {
 		let div = document.createElement('div');
 		div.className = 'bg-success d-flex flex-wrap align-items-center gap-2 p-2 rounded';

 		// time span preparation
 		let timeSpan = document.createElement('span');
 		timeSpan.className = 'badge bg-light text-success rounded-pill small fw-normal';
 		timeSpan.textContent = `${slot.start} - ${slot.end}`;
 		div.appendChild(timeSpan);

 		// detail span preparation
 		let detailSpan1 = document.createElement('span');
 		detailSpan1.className = 'text-light small fw-normal text-wrap';
 		detailSpan1.textContent = `${convertMixedUnicodeToText('ஓரை')}:${slot.orai}`;
 		div.appendChild(detailSpan1);

 		// detail span preparation
 		let detailSpan2 = document.createElement('span');
 		detailSpan2.className = 'text-light small fw-normal text-wrap';
 		detailSpan2.textContent = `${convertMixedUnicodeToText('கௌரி பஞ்சாங்கம்')}:${slot.gowriPanchangam}`;
 		div.appendChild(detailSpan2);

 		// append div to the list container
 		auspiciousList.appendChild(div);
 	}

 	// Make the auspicious time slot visible when time slots are exist
 	if (timeSlots.length > 0) {
 		auspiciousContainer.style.display = 'block';
 	} else {
 		auspiciousContainer.style.display = 'none';
 	}
}