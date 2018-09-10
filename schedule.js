var fs = require('fs');
const loginUrl = "https://connect.fontys.nl/my.policy";
const baseUrl = "https://connect.fontys.nl/";
const scheduleUrl = "https://www.fontys.nl/roosters/FHTenL-I/37/c/c00003.htm";
const SCHEDULE_CREDENTIALS_PATH = "fontys.json";
var request = require('request-promise');
var credentials = JSON.parse(fs.readFileSync(SCHEDULE_CREDENTIALS_PATH, 'utf8'));
var screenshot = "login.png";

function GetScheduleData() {
	LoginToService();
}

function LoginToService(browser) { 
	var payload = {'username': credentials.username,'password': credentials.password, 'vhost': 'standard'}
	request.get(baseUrl).then(function(){
		return request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url: loginUrl
		});
	}).catch(err => console.log);
};
module.exports = {"GetScheduleData": GetScheduleData, "SCHEDULE_CREDENTIALS_PATH": SCHEDULE_CREDENTIALS_PATH};