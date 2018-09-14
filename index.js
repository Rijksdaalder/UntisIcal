const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const moment = require('moment-timezone');
const http = require('http');
const ical = require('ical-generator');
const schedule = require('./schedule.js');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';


// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
  checkCredentialExistance(function(err) {
  	if(err) throw err;
  });

});


/**
 * Checks if there is a credential JSON file available
 * @param  {Function} callback the callback with an error if there is one
 */
function checkCredentialExistance(callback) {
	var error = null;
	if(!fs.existsSync(schedule.SCHEDULE_CREDENTIALS_PATH)) {
		//Config file doesn't exist, create it
		console.log("Creating credentials file for login to schedule");
		var obj = {"username": "", "password": ""};
		var jsonvalue = JSON.stringify(obj);
		fs.appendFile(schedule.SCHEDULE_CREDENTIALS_PATH, jsonvalue, function(err) {
			if(err) error = err;
		});
	}
	callback(error)
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  	
  	//first create schedule entity
  	const scheduleInstance = new schedule.Schedule(43, "TIPA", false);


    var server = http.createServer(function(req, res) {
        
    });
    server.listen(3000, function() {
      console.log('Server running at port 3000');
    });
    server.on('request', function(request, response) {
      console.log("got a request, returning calendar ical");
      scheduleInstance.GetSchedule(response);
    });
}