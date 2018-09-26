const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const moment = require('moment-timezone');
const http = require('http');
const ical = require('ical-generator');
const schedule = require('./schedule.js');
const url = require('url');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';
const version = "1.2.2";
const port = 61033;


console.log("CalendarUpdater version " + version + "|Author(Sjoerd)");



instantiateServer();


/**
 * Lists the next 10 events on the user's primary calendar.
 */
function instantiateServer() {
  	
  	//first create schedule entity
  	const scheduleInstance = new schedule.Schedule(43, "TIPA", false);

    var server = http.createServer();
    server.listen(port, function() {
      console.log('Server running at port ' + port);
    });
    server.on('request', function(request, response) {
      var params = url.parse(request.url, true).query;
      console.log("got a request, returning calendar ical");

      if(params.instituteId != null && params.className != null) {
        console.log("params are not null");
          if(scheduleInstance.className != params.className) {
            console.log("Clearing cache & updating class data");
            scheduleInstance.updateClassData(params.instituteId, params.className);
          }
      }
      scheduleInstance.GetSchedule(response);
    });
}
