/*
By Vedaant Achuthan -
Program to convert between Equatorial (RaDec) and Horizontal (AltAz) coordinate systems
Dependencies - local-sidereal-time
*/

const LAT = 15.39187;//Latitude - 15° 23' 30.732" 15° 23.5122'
const LONG = 73.88103;//Longitude - 73° 52' 51.708" 73° 52.8618'
const TO_RAD = Math.PI / 180;//For Radian-Degree Conversions
let lstjs = require('local-sidereal-time');//Create package object

//Takes current Local Sidereal Time and returns in hr:min:sec format. To be used in place of lstString for accuracy 
function getLSTString() {
    let LST = lstjs.getLST(new Date(), LONG);
    let rawLST = LST * 3600;
    let remainder = rawLST % 3600;

    let lstHours = Math.floor(rawLST / 3600);
    let lstMinutes = Math.floor(remainder / 60);
    let lstSeconds = Math.floor(remainder % 60);
    return (lstHours.toString() + ":" + lstMinutes.toString() + ":" + lstSeconds.toString());
}

//All inputs and outputs are in decimal format

//Takes Right Ascension (in hours) and Declination (in degrees) and returns Altitude (in degrees)
function getAltitude(ra, dec) {
    let LST = lstjs.getLST(new Date(), LONG);
    let HA = LST - ra;
    let alt = Math.asin(Math.sin(LAT * TO_RAD) * Math.sin(dec * TO_RAD) + Math.cos(LAT * TO_RAD) * Math.cos(dec * TO_RAD) * Math.cos(HA * 15 * TO_RAD));
    return alt / TO_RAD;
}

//Takes Right Ascension (in hours) and Declination (in degrees) and returns Azimuth (in degrees)
function getAzimuth(ra, dec) {
    let LST = lstjs.getLST(new Date(), LONG);
    let HA = LST - ra;
    let x = -Math.sin(LAT * TO_RAD) * Math.cos(dec * TO_RAD) * Math.cos(HA * 15 * TO_RAD) + Math.cos(LAT * TO_RAD) * Math.sin(dec * TO_RAD);
    let y = Math.cos(dec * TO_RAD) * Math.sin(HA * 15 * TO_RAD);
    let az = -Math.atan2(y, x);
    if (az < 0)
        return az / TO_RAD + 360;
    else
        return az / TO_RAD;
}

//Takes Altitude (in degrees) and Azimuth (in degrees) and returns Declination (in degrees)
function getDeclination(alt, az) {
    return (Math.asin(Math.sin(LAT * TO_RAD) * Math.sin(alt * TO_RAD) + Math.cos(LAT * TO_RAD) * Math.cos(alt * TO_RAD) * Math.cos(az * TO_RAD))) / TO_RAD;
}

//Takes Altitude (in degrees) and Azimuth (in degrees) and returns Right Ascension (in decimal hours)
function getRightAscention(alt, az) {
    let LST = lstjs.getLST(new Date(), LONG);
    let x = -Math.sin(LAT * TO_RAD) * Math.cos(alt * TO_RAD) * Math.cos(az * TO_RAD) + Math.cos(LAT * TO_RAD) * Math.sin(alt * TO_RAD);
    let y = Math.cos(alt * TO_RAD) * Math.sin(az * TO_RAD);
    let HA = Math.atan2(y, x);
    HA = HA / (TO_RAD * 15);
    if (HA < 0)
        return LST + HA;
    else
        return LST - HA;
}

//Test case to prove invertibility
let a = getAltitude(2, 50);
let b = getAzimuth(2, 50);
let c = getRightAscention(a, b);
let d = getDeclination(a, b);

//Rounding to 4 decimal places to remove floating point errors
a = Math.round(a * 10000)/10000;
b = Math.round(b * 10000)/10000;
c = Math.round(c * 10000)/10000;
d = Math.round(d * 10000)/10000;

//Output
console.log("Current Local Sidereal Time = " + getLSTString());
console.log("Altitude = " + a);
console.log("Azimuth = " + b);
console.log("Right Ascension = " + c);
console.log("Declination = " + d);
