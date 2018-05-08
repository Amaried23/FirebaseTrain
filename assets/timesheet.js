//Variables

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


// Grabs user input

  var trName = $("#train-name-input").val().trim();
  var trDestination = $("#destination-input").val().trim();
  var trStart = $("#time-input").val().trim();
  var trFreq = $("#frequency-input").val().trim();


  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trName,
    destination: trDestination,
    start: trStart,
    frequency: trFreq,


  };

//Uploads data onto firebase

database.ref().push(newTrain);

  // Alert
  alert("Train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
});

//Creates a Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trName = childSnapshot.val().name;
  var trDestination = childSnapshot.val().destination;
  var trStart = childSnapshot.val().start;
  var trFreq = childSnapshot.val().frequency;
 


  var timeArr = trStart.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var minutesAway;
  var nextArrival;

  // If the first train is later than the current time, sent arrival to the first train time
  if (maxMoment === trainTime) {
    nextArrival = trainTime.format("hh:mm A");
    minutesAway = trainTime.diff(moment(), "minutes");
  } else {

    // Calculates the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, you take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % trFreq;
    minutesAway = trFreq - tRemainder;
    // To calculate the arrival time, you add the minutesAway variable to the current time
    nextArrival = moment().add(minutesAway, "m").format("hh:mm A");
  }
  console.log("minutesAway:", minutesAway);
  console.log("nextArrival:", nextArrival);

  // Add each train's data into the table

  $("#train-table > tbody").append("<tr><td>" + trName + 
    "</td><td>" + trDestination
    + "</td><td>" + trStart 
    + "</td><td>" + trFreq
    + "</td><td>" + minutesAway
    + "</td><td>" + nextArrival
  + "</td></tr>");

});
  
