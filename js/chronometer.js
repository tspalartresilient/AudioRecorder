var timercount = 0;
var timestart  = null;

function showtimer() {
	if(timercount) {
		clearTimeout(timercount);
		clockID = 0;
	}
	if(!timestart){
		timestart = new Date();
	}
	var timeend = new Date();
	var timedifference = timeend.getTime() - timestart.getTime();
	timeend.setTime(timedifference);
  var hours_passed = timeend.getHours();
	if(hours_passed < 10){
		hours_passed = "0" + hours_passed;
	}
	var minutes_passed = timeend.getMinutes();
	if(minutes_passed < 10){
		minutes_passed = "0" + minutes_passed;
	}
	var seconds_passed = timeend.getSeconds();
	if(seconds_passed < 10){
		seconds_passed = "0" + seconds_passed;
	}
	document.getElementById("chronotime").innerHTML = hours_passed + ":" + minutes_passed + ":" + seconds_passed;

	timercount = setTimeout("showtimer()", 1000);
}

function sw_start(){
	if(!timercount){
	timestart   = new Date();
	document.getElementById("chronotime").innerHTML = "00:00:00";
	timercount  = setTimeout("showtimer()", 1000);
	}
	else{
	var timeend = new Date();
		var timedifference = timeend.getTime() - timestart.getTime();
		timeend.setTime(timedifference);
		var minutes_passed = timeend.getMinutes();
		if(minutes_passed < 10){
			minutes_passed = "0" + minutes_passed;
		}
		var seconds_passed = timeend.getSeconds();
		if(seconds_passed < 10){
			seconds_passed = "0" + seconds_passed;
		}
		var milliseconds_passed = timeend.getMilliseconds();
		if(milliseconds_passed < 10){
			milliseconds_passed = "00" + milliseconds_passed;
		}
		else if(milliseconds_passed < 100){
			milliseconds_passed = "0" + milliseconds_passed;
		}
	}
}

function Stop() {
	if(timercount) {
		clearTimeout(timercount);
		timercount  = 0;
		var timeend = new Date();
		var timedifference = timeend.getTime() - timestart.getTime();
		timeend.setTime(timedifference);
    var hours_passed = timeend.getHours();
  	if(hours_passed < 10){
  		hours_passed = "0" + hours_passed;
  	}
		var minutes_passed = timeend.getMinutes();
		if(minutes_passed < 10){
			minutes_passed = "0" + minutes_passed;
		}
		var seconds_passed = timeend.getSeconds();
		if(seconds_passed < 10){
			seconds_passed = "0" + seconds_passed;
		}
		var milliseconds_passed = timeend.getMilliseconds();
		if(milliseconds_passed < 10){
			milliseconds_passed = "00" + milliseconds_passed;
		}
		else if(milliseconds_passed < 100){
			milliseconds_passed = "0" + milliseconds_passed;
		}
		document.getElementById("chronotime").innerHTML = hours_passed + ":" + minutes_passed + ":" + seconds_passed /*+ "." + milliseconds_passed*/;
	}
	timestart = null;
}


function toggleChrono( e ) {
    if (e.classList.contains("chrono")) {
        Stop();
        e.classList.remove("chrono");
    } else {
        e.classList.add("chrono");
        sw_start();
    }
}

// function toggleSave( e ) {
// 		if (e.classList.contains("save")) {
// 				e.classList.remove("save");
// 				document.getElementById("save").href="https://github.com";
// 		} else {
// 				e.classList.add("save");
// 				document.getElementById("save").href="#";
// 		}
// }
