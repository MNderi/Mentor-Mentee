const path= require('path')
const Identity= require('../model/identityModel');
const Program= require('../model/programModel')
const connectDB=require('../model/db')
const validator = require('validator');



exports.homePage=function(req,res){
    res.render('home');
    console.log("Home Page")
}
exports.loginPage=function(req,res){
    res.sendFile(path.join(__dirname,'../public/login.html'));
    console.log("Login Page")
}


exports.handleLogin = async function (req, res) {
    const { mail, password} = req.body;

    try {
        const customRadio = await Identity.handleLogin(mail);

        if (customRadio === 'Mentee') {
            res.redirect("/mentee/profile");
        } else if (customRadio === 'Mentor') {
            res.redirect(`/mentor/profile`);
        } else {
            res.send('Error Logging you in', funame);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.signupPage=function(req,res){
    res.sendFile(path.join(__dirname,'../public/signup.html'));
    console.log("Signup Page")
}

exports.register = async function (req, res) {
    const identity = req.body;

    // Validate Full Name - ensuring it's not empty
    if (validator.isEmpty(identity.funame)) {
        return res.status(400).json({error:"Full name is required."});
    }

    // Validate Email
    if (!validator.isEmail(identity.mail)) {
        return res.status(400).json({error:"Invalid email address."});
    }

    if (!validator.isLength(identity.password, { min: 6 })) {
        return res.status(400).json({error:"Password must be at least 6 characters long."});
    }

    if (!validator.equals(identity.password, identity.confirmpassword)) {
        return res.status(400).json({error:"Passwords do not match."});
    }

    if (!validator.isIn(identity.customRadio, ['Mentee', 'Mentor'])) {
        return res.status(400).json({error:"Invalid role selection."});
    }

    try {
        const newUser = await Identity.registerNewUser(identity);
        console.log('User created successfully');
        res.render('registered', { name: newUser.funame });
    } catch (err) {
        console.error('Error creating identity:', err);
        res.status(500).json({error:"Internal Server Error"});
    }

};


  
  exports.findAll = async function (req, res) {
    try {
      const documents = await Program.find({});
  
      console.log('Documents retrieved:', documents);
      res.render('findAll',{programs: documents});
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  };

  exports.mentorfindAll = async function (req, res) {
    try {
      const documents = await Program.find({});
  
      console.log('Documents retrieved:', documents);
      res.render('mentorfindAll',{programs: documents});
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  };

exports.adminView=async function(req, res){
    try {
        const filter = { customRadio: 'Mentee' };

        const mentees = await Identity.find(filter);
        res.render('admindashboard', {users:mentees });
    } catch (error) {
        console.error('Error reading mentees:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.deleteMentee = async function (req, res) {
    const funame = req.params.funame; 

    if (!funame) {
        return res.status(400).send("Invalid name parameter.");
    }

    try {
        const result = await Identity.deleteOne({ funame: funame, customRadio:'Mentee'});

        if (result.deletedCount === 1) {
            console.log(result.deletedCount + " document removed from the database");
            res.send("We have removed " + funame);
        } else {
            console.log("Document not found");
            res.send("Mentee not found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateMentee = async function (req, res) {
    const email = req.params.mail;
    const updateData = req.body;

    try {
        const updatedMentee = await Identity.updateUserDetails(email, updateData);
        console.log(updatedMentee, "document updated");
        res.send("We have updated " + updatedMentee.funame);
    } catch (err) {
        console.error(err);
        res.send("Error updating Mentee.");
    }
};

exports.menteeTasks = async function (req, res) {
    const username = res.locals.username;
    const mail=req.params.mail;
    console.log(username , mail)
    try {
      // Find the user
      const user = await Identity.findOne({ mail: username, customRadio: "Mentee" });

  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Get the list of programs the user is enrolled in
      const enrolledPrograms = user.enrolled;
      const goals=user.goals;
      console.log("goals", goals)
      if (!enrolledPrograms || enrolledPrograms.length === 0) {
        return res.render('tasks', { myPrograms: [], goals: goals });
    }
      // Find the details of each enrolled program in the Program database
      const programDetails = await Program.find({
        $or: enrolledPrograms.map(({ program, creator }) => ({
          $and: [{ program }, { creator }],
        })),
      });
  
      console.log('Programs retrieved:', programDetails);
      res.render('tasks', { myPrograms: programDetails, goals:goals });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  

exports.mentorsDashboard=async function(req, res){
        try {
            const filter = { customRadio: 'Mentor' };
    
            const mentors = await Identity.find(filter);
            res.render('admindashboardMentors', {users:mentors });
        } catch (error) {
            console.error('Error reading mentors:', error);
            res.status(500).send('Internal Server Error');
        }
    }

exports.deleteMentor = async function (req, res) {
        const email = req.params.mail;
    
        if (!email) {
            return res.status(400).send("Invalid name parameter.");
        }
    
        try {
            await Identity.deleteMentor(email);
            console.log("Mentor " + email + " and their programs have been successfully removed.");
            res.send("Mentor " + email + " and their programs have been successfully removed.");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error!!");
        }
};    


exports.updateMentor = function (req, res) {
    const email = req.params.mail;
    console.log(req.params.mail);

    if (!email) {
        return res.status(400).send("Invalid email parameter.");
    }
    const { funame, mail, customRadio } = req.body;

    Identity.findOneAndUpdate(
        { mail:email, customRadio:'Mentor'},
        { $set: {funame, mail, customRadio } },
        { new: true } 
    )
        .then(updatedMentor => {
            if (updatedMentor) {
                console.log(updatedMentor, "document updated");
                res.send("We have updated " + funame);
            } else {
                console.log("Mentor not found");
                res.send("Mentor not found.");
            }
        })
        .catch(err => {
            console.error(err);
            res.send("Error updating Mentor.");
        });
};



exports.mentorTasks = async function (req, res) {
    const username = res.locals.username;
    console.log(username);

    try {
        // Find the user
        const user = await Identity.findOne({ mail: username, customRadio: "Mentor" });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const createdPrograms = user.created;
        console.log(createdPrograms);

        if (!createdPrograms || createdPrograms.length === 0) {
            return res.render('mentorTasks', { myPrograms: [] });
        }

        // Find the details of each created program in the Program database
        const programDetails = await Program.find({
            $or: createdPrograms.map(({ program, creator }) => ({
                $and: [{ program, creator }],
            })),
        });

        console.log('Programs retrieved:', programDetails);
        res.render('mentorTasks', { myPrograms: programDetails });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.logout = function (req, res) {
    res.clearCookie("jwt").status(200).redirect("/");
  };
exports.managerLogout=function (req, res) {
    res.clearCookie("jwt").status(200).redirect("/");
  };
  
exports.about= function(req,res){
   res.render('about')
}  
exports.programInfo =function(req,res){
    res.render('programInformation')
}