var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// Toggle between always listening and click-to-listen
var CONTINUOUS = true;

// This is used to print and work with indexed results
// in continuous mode, as they're stacked up.
var inputIndex = 0;

// Setup some example command grammars in groups
// Typically these would be served from somewhere else.
var triggers = '#JSGF V1.0; grammar triggers; public <trigger> = OK Bella | OK Kitchen;'
var commands = '#JSGF V1.0; grammar commands; public <command> = play | pause | repeat | stop | say again;'
var numbers = '#JSGF V1.0; grammar numbers; public <number> = one | two | three | twenty one | thirty two | a hundred;'
var steps = '#JSGF V1.0; grammar steps; public <step> = ingredients | summary | main menu;'
var recipes = '#JSGF V1.0; grammar recipes; public <recipe> = fish fried | fish roasted | fish en papillot | chocolate pot | bean mash | kale;'

// Set up the SpeechRecognition object
var recognition = new SpeechRecognition();
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = CONTINUOUS;

// Add our grammar objects.
// The [optional] second param is priority weighting (0-1), defaults to 1 if not provided.
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(triggers, 1);
speechRecognitionList.addFromString(commands, 1);
speechRecognitionList.addFromString(numbers, 1);
speechRecognitionList.addFromString(steps, 1);
speechRecognitionList.addFromString(recipes, 1);
recognition.grammars = speechRecognitionList;

// Click to listen. In none-continuous mode it'll stop listening when you finish speaking.
document.body.onclick = function() {
  startRecognition();
}

// Kick the listening off.
startRecognition = function() {
  recognition.start();

  if(CONTINUOUS)
    console.log('Starting in CONTINOUS mode.');
  else
    console.log('Starting... please issue a command.');
}

// Print the result, including how sure the API is about what it thinks you said.
recognition.onresult = function(event) {
  var command = event.results[inputIndex][0].transcript;
  console.log('Result received: ' + command);
  console.log('With confidence: ' + event.results[inputIndex][0].confidence);
  console.log('---------------');

  // Potentially do something like 'if confidence > threshold' here before proceeding,
  // to account for noisy environments like a kitchen. Be sure before acting on commands!
  handleCommand(command);

  // In continuous mode, increment so we see the right sample!
  if(CONTINUOUS)
    inputIndex++;
}


handleCommand = function(cmd) {
  //console.log("Handling " + cmd);
}

// Stop the recognition, regardless of if you were understood
// (or even spoke, this gets called after a few seconds of silence)
recognition.onspeechend = function() {
  if(!CONTINUOUS) {
    console.log("Stopping...");
    recognition.stop();
  }
}

// Called when the API heard you, but didn't match a phrase.
recognition.onnomatch = function(event) {
  console.log('Error: No match.');
}

// Called when there's an error, for example a permissions issue.
// This is where you'd potentially catch none-supported platforms and handle it.
recognition.onerror = function(event) {
  console.log('Error: ' + event.error);
}
