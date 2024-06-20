const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/database");
const Device = require("../models/device");

router.post("/register", (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        devices: req.body.devices
    });

    User.addUser(newUser, (err, data) => {
        if (err) {
            res.json({ success: false, msg: err.message });
        }
        else {
            res.json({ success: true, msg: "User registered." });
        }
    });
});

router.post("/authenticate", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const requestId = req.body.requestId;
    const initialDeviceId = req.body.deviceId;
    const maxLoginAttempts = 5;

    //Validate LoginAttempts Is Within Range
    Device.getDeviceById(initialDeviceId).then(function (device) {
        console.log("ADASDASD   " + device.loginAttempts);
        if (device.loginAttempts <= maxLoginAttempts) {

            User.getUserByUsername(username, (err, user) => {
                if (err) throw err;
                if (!user) {
                    return Device.addLoginAttempt(initialDeviceId).then(function () {
                        return res.json({ success: false, msg: "User not found" });
                    })
                }


                //Validate Fingerprint DeviceID
                Device.validateDeviceID(requestId).then(function (deviceId) {
                    //If valid capcha compare password
                    //Add device to list
                    //Else
                    if (deviceId) {
                        //Check if the current device is a known device
                        if (User.validateKnownDevice(deviceId, user)) {
                            //Validate Passowrd
                            User.comparePassword(password, user.password, (err, isMatch) => {
                                if (err) throw err;
                                if (isMatch) {
                                    const token = jwt.sign(user.toJSON(), config.secret, {
                                        expiresIn: 604800,
                                    });

                                    //Reset Login Attempt Count
                                    Device.resetLoginAttempt(initialDeviceId).then(function () {
                                        res.json({
                                            succes: true,
                                            token: token,
                                            user: {
                                                id: user._id,
                                                name: user.name,
                                                username: user.username,
                                                email: user.email
                                            }
                                        });
                                    });
                                }
                                else {
                                    return Device.addLoginAttempt(initialDeviceId).then(function () {
                                        return res.json({ success: false, msg: "Wrong password." });
                                    });
                                }
                            });
                        }
                        else {
                            return Device.addLoginAttempt(initialDeviceId).then(function () {
                                return res.json({ success: false, msg: "Current Device Not Found, Please Use 2FA" });
                            });
                        }
                    }
                    else {
                        return Device.addLoginAttempt(initialDeviceId).then(function () {
                            return res.json({ success: false, msg: "Failed Fingerprint Identification" });
                        });
                    }
                });
            });
        }
        else{
            return Device.addLoginAttempt(initialDeviceId).then(function () {
                return res.json({ success: false, msg: "Max Login Attempts Allowed, Contact Support", maxLoginAttempts: true });
            });  
        }
    });
});

router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res, next) => {
    res.json({
        user: req.user
    });
});

module.exports = router;