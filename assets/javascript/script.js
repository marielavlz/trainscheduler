//Psuedo-Code
//When the user opens page, should show current time at the top. Use moment js.
//The filled out form should put the name and destination onto the table. Probably append as is.
//When the user submits, the information is stored on firebase. Should initialise firebase and something with child and snapshot.
//Will likely use .push to push input into firebase.
//Convert the input HH:mm into LT.


$(document).ready(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA3lrNrHuvqi7sfW4CRaQ-Cq132SyUEYN4",
    authDomain: "trainscheduler-40b97.firebaseapp.com",
    databaseURL: "https://trainscheduler-40b97.firebaseio.com",
    projectId: "trainscheduler-40b97",
    storageBucket: "trainscheduler-40b97.appspot.com",
    messagingSenderId: "370756748837"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// when user hits submit
$("#addTrain").on("click", function() {
//Just in case
	event.preventDefault();

//assign variables to every input
	var name = $('#inputName').val().trim();
    var destination = $('#inputDestination').val().trim();
    var time = $('#inputTime').val().trim();
    var freq = $('#inputFrequency').val().trim();

// push entry into firebase
	database.ref().push({
		name: name,
		destination: destination,
    	time: time,
    	freq: freq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
	$("input").val('');
    return false;
});

//child function
database.ref().on("child_added", function(childSnapshot){
	// console.log(childSnapshot.val());
	var name = childSnapshot.val().name;
	var destination = childSnapshot.val().destination;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

	console.log("Name: " + name);
	console.log("Destination: " + destination);
	console.log("Time: " + time);
	console.log("Frequency: " + freq);

//time converter
	var freq = parseInt(freq);
	//current time
	var currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
	console.log("current time:" + moment().format('HH:mm'));
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("date converted: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("train time : " + trainTime);
	
	//time difference
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("difference in time: " + tDifference);
	//remainder 
	var tRemainder = tDifference % freq;
	console.log("time remaining " + tRemainder);
	//min until next train
	var minsAway = freq - tRemainder;
	console.log("min until next train: " + minsAway);
	//next train
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("arrival " + moment(nextTrain).format('HH:mm A'));

 //creating a table
$('#currentTime').html(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destinationDisplay'>" + childSnapshot.val().destination +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("LT") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});

});