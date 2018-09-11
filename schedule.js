var fs = require('fs');
var request = require('request');
const SCHEDULE_CREDENTIALS_PATH = "fontys.json";
var credentials = JSON.parse(fs.readFileSync(SCHEDULE_CREDENTIALS_PATH, 'utf8'));
//Related to table parsing
const loginUrl = "https://connect.fontys.nl/my.policy";
const baseUrl = "https://connect.fontys.nl/";
const scheduleUrl = "https://www.fontys.nl/roosters/FHTenL-I/37/c/c00003.htm";

//Related to the JSON API
const apiUrl = "https://api.fontys.nl/json.ashx?app=M50h7mWVl0i46ZPk0Fftug&iPlannerRooster_action=lessen";
const instituteId = 43; //43 = venlo
const classId = "TIPA"; //

function LoginToService(browser) { 
	var payload = {'username': credentials.username,'password': credentials.password, 'vhost': 'standard'}
	request.get(baseUrl).then(function() {
		return request.post({
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
			url: loginUrl
		});
	}).catch(err => console.log);
};
function GetScheduleData(callback) {
	//&iPlannerRooster_instituut=43&iPlannerRooster_klas=TIPA
	var endpoint = apiUrl + "&iPlannerRooster_instituut=" + instituteId;
	endpoint += "&iPlannerRooster_klas=" + classId;
	request.get(endpoint, function(err, response, body) {
		if(err) callback(err);
		var obj = JSON.parse(body);
		console.log(obj);
		callback(null, obj);
	});

}
module.exports = {"GetScheduleData": GetScheduleData, "SCHEDULE_CREDENTIALS_PATH": SCHEDULE_CREDENTIALS_PATH};