const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require('axios');

const DeviceSchema = mongoose.Schema({
    deviceID : {
        type: String,
    },
    loginAttempts : {
        type: Number
    },
    suspended : {
        type: Boolean
    }
});

const Device = module.exports = mongoose.model("Device", DeviceSchema);

module.exports.getDeviceById =  async function(deviceID, callback){
    const query = {deviceID: deviceID};
    const res = Device.findOne(query);
    return res;
}

module.exports.blockDevice = async function(deviceID, callback){
    const filter = { deviceID: deviceID };
    const update = { suspended: true}

    // Set Device ID
    const res = await Device.updateOne(filter, update);
    console.log(res);
    return res;
}

module.exports.addDevice = function(newDevice, callback){
    Device.findOne({deviceID : newDevice.deviceID}, (err, device) => {
        if(device) {
            callback(device);
        }
        else {
            newDevice.save(callback);
            //callback("Device registered.", device);
        }
    });
}

module.exports.validateDeviceID =  async function (requestId){
    //Log requestId
    console.log("requestId: " + requestId);

    //Get User Data
    return axios.get("https://metrics.buyhomedesigns.com/events/" + requestId, {headers: {'Auth-API-Key': '0a3KwLcOpiNardFDq7Jl'}})
    .then(function(res) {
        const visitorData = res.data.products.identification.data;
        //console.log(res);
        console.log('Status Code:', res.status);

        //If Status != 200 do stuff
        if(res.status != 200){
            return false;
        }

        // The returned data must have the expected properties.
        if (res.error || visitorData.visitorId == undefined) {
            return false;
        }

        if (new Date().getTime() - visitorData.timestamp > 3000) {return false}

        console.log("Timestamp " +(new Date().getTime() - visitorData.timestamp));

        // The Confidence Score must be of a certain level.
        console.log("confidence score: " + visitorData.confidence.score);
        if (visitorData.confidence.score < 0.95) {
            return false;
        }

        // This is an example of obtaining the client's IP address.
        // In most cases, it's a good idea to look for the
        // right-most external IP address in the list to prevent spoofing.
        /*
        console.log("IPS: " + res.headers["x-forwarded-for"].split(",")[0] + " : " + visitorData.ip);
        if (res.headers["x-forwarded-for"].split(",")[0] !== visitorData.ip) {

        }

        //Check origin 
        const ourOrigins = ["https://metrics.buyhomdesigns.com"];
        console.log(visitorData.url.origin);

        const visitorDataOrigin = visitorData.url.origin;

        // Confirm that the authentication request is from a known origin.
        if (visitorDataOrigin !== res.headers["origin"] || !ourOrigins.includes(visitorDataOrigin) || !ourOrigins.includes(res.headers["origin"])){

        }
        */
        console.log(visitorData.visitorId);
        return visitorData.visitorId;
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });
}

module.exports.addLoginAttempt = async function(deviceId){
    const filter = { deviceID: deviceId };
    const update = {$inc : { loginAttempts: 1}}

    // Set Device ID
    const res = await Device.updateOne(filter, update);
}

module.exports.resetLoginAttempt = async function(deviceId){
    const filter = { deviceID: deviceId };
    const update = { loginAttempts: 0}

    // Set Device ID
    const res = await Device.updateOne(filter, update);
}
