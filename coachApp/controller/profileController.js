const upload = require('./multer');
const path= require('path')
const {check, validationResult} = require('express-validator'); 
const Identity= require('../model/identityModel');
const connectDB=require('../model/db')

//Mentee Related functions
exports.menteeProfileUpdate = async function (req, res) {
    const username = res.locals.username;
    const { funame, about, occupation } = req.body;
    
    // Construct the update object
    let updateData = {
        funame,
        'profile.about': about,
        'profile.occupation': occupation
    };

    // Add profilePicture to the update object only if a file is uploaded
    if (req.file) {
        updateData['profile.profilePicture'] = `/public/uploads/${req.file.filename}`;
    }

    try {
        const updatedIdentity = await Identity.updateUserProfile(username, "Mentee", updateData);
        res.status(200).send('Profile updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

  

exports.menteeProfile = async function(req, res) {
    try {
        const mail = res.locals.username;
        const user = await Identity.fetchUserProfile(mail, 'Mentee');
        res.render('profile', { identity: user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addGoals = async (req, res) => {
    const menteeUsername = res.locals.username;
    console.log("goals",req.body)
    try {
        const mentee = await Identity.findOne({ mail: menteeUsername });
        if (!mentee) {
            return res.status(404).json({ error: 'Mentee not found' });
        }
        // Check if goals array is present in the request body
        if (Array.isArray(req.body.goals)) {
            // Directly assign the goals array from the request to the mentee's goals
            mentee.goals = req.body.goals;
        } else {
            // Handle cases where no goals are selected or the goals array is not sent
            mentee.goals = [];
        }

        // Save the updated mentee to the database
        await mentee.save();
        return res.status(200).json({ message: 'Goals added successfully', mentee });
    } catch (error) {
        console.error('Error adding goals:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


//mentor related functions

exports.mentorProfile = async function(req, res) {
    try {
        const mail = res.locals.username;
        const user = await Identity.fetchUserProfile(mail, 'Mentor');
        res.render('mentorProfile', { identity: user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


exports.mentorProfileUpdate = async function (req, res) {
    const username = res.locals.username;
    const { funame, about, occupation } = req.body;
    let updateData = {
        funame,
        'profile.about': about,
        'profile.occupation': occupation
    };

    // Only add profilePicture to the update if a file has been uploaded
    if (req.file) {
        updateData['profile.profilePicture'] = `/public/uploads/${req.file.filename}`;
    }

    try {
        const updatedIdentity = await Identity.updateUserProfile(username, "Mentor", updateData);
        res.status(200).send('Profile updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


exports.deleteGoals = async (req, res) => {
    const menteeUsername = res.locals.username;
    const goalsToDelete = req.body.deleteGoals; // This will be an array of goal values

    try {
        const mentee = await Identity.findOne({ mail: menteeUsername });
        if (!mentee) {
            return res.status(404).json({ error: 'Mentee not found' });
        }

        // Filter out the goals that are to be deleted
        mentee.goals = mentee.goals.filter(goal => !goalsToDelete.includes(goal));

        // Save the updated mentee to the database
        await mentee.save();
        return res.status(200).json({ message: 'Goals deleted successfully', mentee });
    } catch (error) {
        console.error('Error deleting goals:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

  
