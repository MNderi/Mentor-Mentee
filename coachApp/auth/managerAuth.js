
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Manager }=require('../model/managerModel');

exports.authenticateManager =  function (req, res, next) {
    const email = req.body.mail;
    const password = req.body.password;
    console.log(email, password);

    // Use the Manager model for lookup
    Manager.findOne({ mail: email })
      .exec()
      .then((manager) => {
        if (!manager) {
          console.log("Manager", email, "not found");
          res.send("Not a manager honey!");
        } else {
          // Compare provided password with stored password
          bcrypt.compare(password, manager.password, function (err, result) {
            if (result) {
              // Use the payload to store information about the manager, such as email.
              let payload = { email: email, role: 'manager' };
              console.log(payload);
              // Create the access token
              let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 1800 });
              res.cookie("jwt", accessToken);
              res.locals.email = email;
              next();
            } else {
              console.log("Password mismatch for manager", email);
              res.rediret('/manager/login');
            }
          });
        }
      })
      .catch((err) => {
        console.log("Error looking up manager", err);
        return res.status(401).send();
      });
};

exports.verifyToken = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
        return res.status(403).send();
    }
    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user's role is 'manager'
        if (payload.role !== 'manager') {
            return res.status(403).send("Access denied");
        }

        res.locals.email = payload.email;

        next();
    } catch (e) {
        console.log("Error verifying token", e);
        return res.render('managerLogin', { message: 'Session expired. Please log in again.' });
    }
};
