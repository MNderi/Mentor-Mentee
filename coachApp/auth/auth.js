const bcrypt = require("bcrypt");
const path = require("path");
const Identity = require("../model/identityModel"); 
const jwt = require("jsonwebtoken");


exports.login = function (req, res, next) {
    const username = req.body.mail;
    let password = req.body.password;
    console.log(username, password)
  
    // Use the Identity model for lookup
    Identity.findOne({ mail: username })
      .exec()
      .then((user) => {
        if (!user) {
          res.sendFile(path.join(__dirname, '../public/signup.html'));
        } else {
          // Compare provided password with stored password
          bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
              // Use the payload to store information about the user, such as username.
              let payload = { username: username };
              console.log(payload);
              // Create the access token
              let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 300 });
              res.cookie("jwt", accessToken);
              res.locals.username = username;
              next();
            } else {
                console.log("Password mismatch for user", username);
                res.sendFile(path.join(__dirname, '../public/login.html'));
              }
            });
        }
      })
      .catch((err) => {
        console.log("Error looking up user", err);
        return res.status(401).send();
      });
  };

  exports.verify = function (req, res, next) {
    let accessToken = req.cookies.jwt;
    if (!accessToken) {
      return res.redirect('/login?session=expired'); // Redirect with a query parameter
    }
  
    try {
      let payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    //   req.params.mail = payload.username;
      res.locals.username = payload.username;
      next();
    } catch (e) {
      console.log("Error verifying token", e);
      return res.redirect('/login?session=expired'); // Redirect with a query parameter
    }
  };
  

