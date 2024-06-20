const express = require("express");
const router = express.Router();
const jwt = require ("jsonwebtoken");
const Device = require("../models/device");
const config = require("../config/database");



router.post("/register", (req, res, next) => {
    let newDevice = new Device({
        deviceID: req.body.deviceID,
        loginAttempts : req.body.loginAttempts,
        suspended : req.body.suspended
    });

    Device.addDevice(newDevice, (err, data)=> {
        if(err){
            console.log(err);
            res.json({success: true, msg: "Visitor ID Found By Device"});
        }
        else {
            console.log("SUCCESSS")
            res.json({success: true, msg: "Device registered."});
        }
    });
});

router.post("/suspend-device", (req, res, next) => {
    let deviceId = req.body.deviceID;
    console.log(req.body);
    Device.blockDevice(deviceId, (err, data)=> {
        if(err){
            res.json({success: true, msg: "Device Failed To Block"});
        }
        else {
            res.json({success: true, msg: "Device Blocked."});
        }
    });
});


module.exports = router;