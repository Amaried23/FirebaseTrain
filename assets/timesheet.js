//Variables

var trName = "";
var trDestination = "";
var trStart = "";
var trFreq = 0;

//Initializing firebase


var config = {
    apiKey: "AIzaSyACWb9VRSDDcM0SY4-Iw-mOjGHyUXXk79c",
    authDomain: "polarexpress-f74d4.firebaseapp.com",
    databaseURL: "https://polarexpress-f74d4.firebaseio.com",
    projectId: "polarexpress-f74d4",
    storageBucket: "polarexpress-f74d4.appspot.com",
    messagingSenderId: "324628580789"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// Button for adding information entered

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

// Grabs user input

  var trName = $("#train-name-input").val().trim();
  var trDestination = $("#destination-input").val().trim();
  var trStart = $("#time-input").val().trim();
  var trFreq = $("#frequency-input").val().trim();

  //Converting entered time into military time using momentjs
  enteredtimeConverted = moment(trStart,"hh:mm a");
  


  var currentTime = moment ();


//Difference between the time that was entered and the time it is now in minutes

  dTime = moment().diff(moment(enteredtimeConverted), "minutes");


// time apart from train frequency and train time
  var tA = dTime % trFreq;


   var minutesAway = trFreq - tA;


   var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");



var newTrain = {
    name: trName,
    destination: trDestination,
    start: trStart,
    frequency: trFreq,
    arrival: nextArrival,
    minutes: minutesAway

  };
//Uploads data onto firebase

  database.ref().push(newTrain);

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trName = childSnapshot.val().name;
  var trDestination = childSnapshot.val().destination;
  var trStart = childSnapshot.val().start;
  var trFreq = childSnapshot.val().frequency;
  var minutesAway = childSnapshot.val().minutes;
  var nextArrival = childSnapshot.val().arrival;

//Adding each trains data into table

  $("#train-table > tbody").append("<tr><td>" + trName + 
  	"</td><td>" + trDestination
  	+ "</td><td>" + trStart 
  	+ "</td><td>" + trFreq
  	+ "</td><td>" + minutesAway
  	+ "</td><td>" + nextArrival
	+ "</td></tr>");

});
  
