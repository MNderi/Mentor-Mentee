const connectDB=require('../model/db');
const Identity = require('../model/identityModel');
const Program=require('../model/programModel');

exports.addProgram = async function (req, res) {

  try {
      const { program, date, endDate, venue, description, category, creator } = req.body;
      console.log( program, date, endDate, venue, description, category,creator )

      const username = res.locals.username;
      console.log('res.locals.username',username);

      const newProgram = new Program({
          program,
          date,
          endDate,
          venue,
          description,
          category,
          creator,
      });

      // Save the program to the database
      await newProgram.save();

      await Identity.findOneAndUpdate(
          { mail: username, customRadio:"Mentor"},
          { $push: { created: { program,creator} } },
          { new: true }
      );

      res.status(201).send('Program created successfully');
  } catch (error) {
      console.error('Error creating program:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.mentor=function(req,res){
    res.render('mentorPage');
}
exports.ProgramsDashboard=async function(req, res){
  try {
      const programs = await Program.find();
      res.render('admindashboardPrograms', {programs:programs });
  } catch (error) {
      console.error('Error reading Programs:', error);
      res.status(500).send('Internal Server Error');
  }
}

// show specific program
exports.specificProgram = async function (req, res) {
  const { program, creator } = req.body;
  const username = res.locals.username;

  try {
      // First, find the user to determine their role
      const user = await Identity.findOne({ mail: username });
      
      // Check if the user was found
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const role = user.customRadio;

      // Then, find the program
      const foundProgram = await Program.findOne({ program, creator });

      if (!foundProgram) {
          res.status(404).json({ error: 'Program not found' });
      } else if (role === "Mentee") {
          res.render('programInformation', { program: foundProgram });
      } else if (role === "Mentor") {
          res.render("mentorSpecificProgram", { program: foundProgram });
      }
  } catch (error) {
      console.error('Error finding specific program:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.specificProgramMentor = async function (req, res) {
  const { program, creator } = req.body;

  try {
    const foundProgram = await Program.findOne({ program, creator });

    if (!foundProgram) {
      res.status(404).json({ error: 'Program not found' });
    } else {
      res.render('mentorprogramTools', { program: foundProgram });
    }
  } catch (error) {
    console.error('Error finding specific program:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteProgram = async function (req, res) {
  try {
      const { program, creator } = req.params;

      // Delete the program from the Program collection
      const result = await Program.deleteOne({ program: program, creator });

      if (result.deletedCount === 1) {
          // Update the Identities collection to remove the program from enrolled and created fields
          await Identity.updateMany(
              { $or: [{ enrolled: { $elemMatch: { program: program, creator } } }, { created: { $elemMatch: { program: program } } }] },
              {
                  $pull: {
                      enrolled: { program: program, creator },
                      created: { program: program },
                  },
              }
          );

          console.log(result.deletedCount + ' document removed from the database');
          res.send('We have removed ' + program);
      } else {
          console.log('Document not found');
          res.send('Program not found.');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Error!!');
  }
};

exports.enrollMentee = async function (req, res) {
  const { program, creator} = req.body;
  const username = res.locals.username;
  console.log("body",req.body);
  console.log(program, creator, username)
  try {
    // Find the user
    const user = await Identity.findOne({ mail: username, customRadio:"Mentee"});

    console.log(user)

    if (!user) {
      return res.status(404).send( 'User not found');
    }

    // Check if the user is already enrolled in the program
    const isEnrolled = user.enrolled.some((enrollment) => enrollment.program === program && enrollment.creator === creator);

    if (isEnrolled) {
      return res.status(400).send( 'User is already enrolled in this program' );
    }

    // Find the program
    const programObj = await Program.findOne({ program, creator });

    if (!programObj) {
      return res.status(404).send( 'Program not found');
    }

    programObj.numberEnrolled += 1;

    await programObj.save();

    user.enrolled.push({ program, creator });

    // Save the updated user
    await user.save();

    return res.status(200).send('Enrollment successful' );
  } catch (error) {
    console.error('Error enrolling user:', error);
    return res.status(500).send( 'Internal Server Error');
  }
};

exports.unenrollMentee = async function (req, res) {
  const { program, creator } = req.body;
  const username = res.locals.username;

  try {
    // Find the user
    const user = await Identity.findOne({ mail: username, customRadio: "Mentee" });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the user is enrolled in the program
    const enrollmentIndex = user.enrolled.findIndex(enrollment => enrollment.program === program && enrollment.creator === creator);

    if (enrollmentIndex === -1) {
      return res.status(400).send('User is not enrolled in this program');
    }

    // Find the program
    const programObj = await Program.findOne({ program, creator });

    if (!programObj) {
      return res.status(404).send('Program not found');
    }

    // Decrease the number of enrolled users for the program
    programObj.numberEnrolled -= 1;

    await programObj.save();

    user.enrolled.splice(enrollmentIndex, 1);

    await user.save();

    return res.status(200).send('Unenrollment successful');
  } catch (error) {
    console.error('Error unenrolling user:', error);
    return res.status(500).send('Internal Server Error');
  }
};


exports.deleteMyProgram = async function (req, res) {
  const { program, creator } = req.body;
  const username=res.locals.username;
  console.log(program,creator);
  console.log(username);

  try {
    const result = await Program.deleteOne({ program, creator });

    if (result.deletedCount === 1) {
      await Identity.updateOne({ mail: username, customRadio:"Mentor", 'created.program': program }, { $pull: { created: { program } } });

      await Identity.updateMany({}, { $pull: { enrolled: { program, creator } } });

      return res.status(200).send('Program deleted successfully');
    } else {
      return res.status(404).json({ error: 'Program not found' });
    }
  } catch (error) {
    console.error('Error deleting program:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.patcher=async (req, res) => {
  try {
    const programId = req.params.id;
    const updates = req.body;
    const allowedUpdates = ['goals', 'skills', 'projection'];
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }

    const program = await Program.findByIdAndUpdate(programId, updates, { new: true, runValidators: true });

    if (!program) {
      return res.status(404).send();
    }

    res.send(program);
  } catch (e) {
    res.status(400).send(e);
  }
}

exports.mentorEditProgram = async function (req, res) {
  const name = req.body.initialname;
  const Creator = req.body.creator; 

  if (!name) {
      return res.status(400).send("Invalid Program name parameter.");
  }
  const { program, date, endDate, venue, category } = req.body;

  try {
    // Step 1: Update the Program
    const updatedProgram = await Program.findOneAndUpdate(
        { program: name, creator: Creator },
        { $set: { program, date, endDate, venue, category } },
        { new: true }
    );

    if (!updatedProgram) {
      return res.send("Program not found.");
    }

    console.log(updatedProgram, "document updated");

    // Step 2: Update the Identity documents
    // Update the `created` array for the creator
    await Identity.updateMany(
      { 'created.program': name, 'created.creator': Creator },
      { $set: { 'created.$[elem].program': program } },
      { arrayFilters: [{ 'elem.program': name, 'elem.creator': Creator }] }
    );

    await Identity.updateMany(
      { 'enrolled.program': name, 'enrolled.creator': Creator },
      { $set: { 'enrolled.$[elem].program': program } },
      { arrayFilters: [{ 'elem.program': name, 'elem.creator': Creator }] }
    );

    res.send("We have updated " + name);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating Program.");
  }
};

exports.updateProgram= async function (req, res) {
  const name = req.body.program;
  const Creator=req.body.creator;

  if (!name) {
      return res.status(400).send("Invalid Program name parameter.");
  }
  const { program, date, endDate, venue, category } = req.body;

  try {
    // Step 1: Update the Program
    const updatedProgram = await Program.findOneAndUpdate(
        { program: name, creator: Creator },
        { $set: { program, date, endDate, venue, category } },
        { new: true }
    );

    if (!updatedProgram) {
      return res.send("Program not found.");
    }

    console.log(updatedProgram, "document updated");

    // Step 2: Update the Identity documents
    // Update the `created` array for the creator
    await Identity.updateMany(
      { 'created.program': name, 'created.creator': Creator },
      { $set: { 'created.$[elem].program': program } },
      { arrayFilters: [{ 'elem.program': name, 'elem.creator': Creator }] }
    );

    // Update the `enrolled` array for enrolled users
    await Identity.updateMany(
      { 'enrolled.program': name, 'enrolled.creator': Creator },
      { $set: { 'enrolled.$[elem].program': program } },
      { arrayFilters: [{ 'elem.program': name, 'elem.creator': Creator }] }
    );

    res.send("We have updated " + name);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating Program.");
  }
};