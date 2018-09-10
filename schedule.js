var fs = require('fs');
const puppeteer = require('puppeteer');
const var loginUrl = "https://connect.fontys.nl/my.policy";
const var scheduleUrl = "https://www.fontys.nl/roosters/FHTenL-I/37/c/c00003.htm";
var credentials = JSON.parse(fs.readFileSync('fontys.json', 'utf8'));
var screenshot = "login.png";
function LoginToService() {
	const browserInstance = await puppeteer.launch({headless: true});
	  const page = await browser.newPage()
	  await page.goto(puppeteer)
	  await page.type('#username', credentials.username)
	  await page.type('#password', credentials.password)
	  await page.click('[type="submit"]')
	  await page.waitForNavigation()
	  await page.screenshot({ path: screenshot })
	  browser.close()
	  console.log('See screenshot: ' + screenshot);	
}
module.exports = {"login": LoginToService};