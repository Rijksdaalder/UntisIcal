# Untis Ical
A handy tool to update your Google calendar by parsing an Untis schedule

# What does it do?
Calendar updates parses & processes an Untis schedule and formats it to become a valid iCalendar file made with Node JS. This iCalendar file is served on a webhost.
Using this tool you can synchronize your schedule with your appointments by using the generated file as an update link.

# How do I use it
The server's listener defaults to port `3000` on `localhost`.
## Setup
Create a folder to hold the Node JS project  
`mkdir scheduler`  
`cd scheduler`  
Clone the repository in the before defined location  
`git clone https://github.com/yeahspang/CalendarUpdater.git`  
Install all missing dependencies using NPM  
`npm install`  
Run the application
`node index.js`

### Keep it running
To make sure that the project will restart on a reboot or crash, make use of [pm2](http://pm2.keymetrics.io/)

## Parameters
The application accepts 2 `GET` parameters. One is for the institute ID and the other for the name of the class schedule (most likely your class name)

`instituteId` => `integer` Defaults to `43`  
`className` => `string` Defaults to `TIPA`  

## Credentials
The application may ask for a Fontys.json file. This file is used if the API requires authentication. The structure of this file is:
```javascript
{
  "username": "USERNAME", 
  "password": "PASSWORD"
}
```
Where capital `USERNAME` should be your university's username and capital `PASSWORD` should be your password.
