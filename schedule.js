var fs = require('fs');
var request = require('request');
const moment = require('moment-timezone');
const ical = require('ical-generator');
const SCHEDULE_CREDENTIALS_PATH = "fontys.json";
//Related to table parsing
const loginUrl = "https://connect.fontys.nl/my.policy";
const baseUrl = "https://connect.fontys.nl/";
const scheduleUrl = "https://www.fontys.nl/roosters/FHTenL-I/37/c/c00003.htm";


class Schedule {

	constructor(instituteId, className, ShouldGetLoginCookies = false) {
		//Get the credentials
		this.clearCache();
		//this.credentials = JSON.parse(fs.readFileSync(SCHEDULE_CREDENTIALS_PATH, 'utf8'));
		this.instituteId = instituteId == null ? 43 : instituteId; //43 = Fontys Venlo
		this.className = className == null ? "TIPA" : className;
		this.calendar = ical({
	    	domain: 'ical.arcticiced.com',
	      	url: 'ical.arcticiced.com',
		    prodId: {company: 'unknown', product: 'Fontys Ical'},
		    name: 'TIPA feed',
		    timezone: 'Europe/Amsterdam'
		});
		this.apiUrl = "https://api.fontys.nl/json.ashx?app=M50h7mWVl0i46ZPk0Fftug&iPlannerRooster_action=lessen";
		if(ShouldGetLoginCookies) {
			loginToService(function(err, cookies) {
				if(err) console.log(err);
				this.cookies = cookies;
			});
		}

	}
	updateClassData(instituteId, classname) {
		this.clearCache();
		this.instituteId = instituteId;
		this.className = classname;
	}
	clearCache() {
		this.cachedData = { "fetchedAt": null, "data": null };
	}
	loginToService(callback) {
		var payload = {'username': credentials.username,'password': credentials.password, 'vhost': 'standard'}
		request.get(baseUrl).then(function() {
			return request.post({
				headers: {'content-type' : 'application/x-www-form-urlencoded'},
				url: loginUrl
			});
		}).catch(err => console.log);
		return callback(null, null) //TODO: implement actual response headers
	}
	GetScheduleData(callback) {
		var _this = this;
		//Prepare the endpoint
		var endpoint = _this.apiUrl + "&iPlannerRooster_instituut=" + this.instituteId;
		endpoint +="&iPlannerRooster_klas=" + this.className;
		request.get(endpoint, function(err, response, body) {
			if(err) callback(err);
			var obj = JSON.parse(body);
			callback(null, obj);
		});
	}
	GetSchedule(response, callback) {
		var _this = this;
      	var yesterday = moment().subtract(1, "day");
      	if(_this.cachedData['fetchedAt'] == null || _this.cachedData['fetchedAt'].diff(yesterday, 'days') >= 1) {
      		//Make a new request and cache it
      		_this.GetScheduleData(function(err, data) {
	        	if(err) console.log(err);
        		var data = data['iPlannerRooster'];
        		_this.cachedData['fetchedAt'] = moment();
        		_this.cachedData['data'] = data;
        		_this.setCalendarData(data, function (err) {
        			if(err) console.log(err);
        			_this.calendar.serve(response);
        		});
      		});
		}else {
	      	_this.setCalendarData(_this.cachedData['data'], function(err) {
    			if(err) console.log(err);	
        		_this.calendar.serve(response);
      		});
		}
	}
	setCalendarData(data, callback) {
		var _this = this;
		//First clear calendar of data
		_this.calendar.clear();
		var shadowCopy = data.slice();
		//Remove duplicates in the data
		for (var i = 0; i < shadowCopy.length; i++) {
			for (var j = 1; j < shadowCopy.length; j++) {
				if(shadowCopy[i]['Start'] == shadowCopy[j]['Start'] && shadowCopy[i]['Eind'] == shadowCopy[j]['Eind']) {
					//is duplicate
					shadowCopy.splice(j, 1);
				}
			}
		}


		//Prepare actual data
	    for (var i = 0; i < shadowCopy.length; i++) {
	    	if(shadowCopy[i] !== null) {
		      var summary = shadowCopy[i]['Vak'] + " in lokaal: " + shadowCopy[i]['Lokaal'] + " van docent " + shadowCopy[i]['DocentAfkorting'];


		      var format = ""
		      var start = moment(shadowCopy[i]['Start']).tz("Europe/Amsterdam").toDate();
		      var end = moment(shadowCopy[i]['Eind']).tz("Europe/Amsterdam").toDate();
		      var event = _this.calendar.createEvent({
		        start: start,
		        end: end,
		        summary: summary,
		      });
		  }
	    }
	    callback(null);
	}

}

module.exports = {"Schedule": Schedule};