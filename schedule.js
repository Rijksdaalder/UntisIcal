var fs = require('fs');
const puppeteer = require('puppeteer');
const loginUrl = "https://connect.fontys.nl/my.policy";
const scheduleUrl = "https://www.fontys.nl/roosters/FHTenL-I/37/c/c00003.htm";
const SCHEDULE_CREDENTIALS_PATH = "fontys.json";
var credentials = JSON.parse(fs.readFileSync(SCHEDULE_CREDENTIALS_PATH, 'utf8'));
var screenshot = "login.png";

async function GetScheduleData() {
	const browser = await puppeteer.launch({headless: false});	
	await LoginToService(browser);
	await ScrapeSchedule(browser);
	browser.close();
}

async function LoginToService(browser) { 
	  	const page = await browser.newPage()
	  	await page.goto(loginUrl)
	  	await page.click('.btn-primary')
	  	await page.waitForNavigation()
	  	await page.waitFor(2000);
  	  	await page.type('#username', credentials.username, {delay: 100})
		await page.type('#password', credentials.password, {delay: 100})
		await page.click('[type="submit"]')
		await page.waitForNavigation()
	};
async function ScrapeSchedule(browser) {
	const page = await browser.newPage()
  	await page.goto(scheduleUrl);
	  const data = await page.evaluate(() => {
	    const firstRow = document.getElementsByTagName("table")[0].rows[0].cells;
	    var firstRowData = [];
	    for (var i = 0; i < firstRow.length; i++) {
	    	firstRowData.push(firstRow[i].innerText);
	    }
	    console.log(firstRowData);
	    return tds.map(td => td.innerHTML)
	  });
	  	console.log(data);
}
module.exports = {"GetScheduleData": GetScheduleData, "SCHEDULE_CREDENTIALS_PATH": SCHEDULE_CREDENTIALS_PATH};