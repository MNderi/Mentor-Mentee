
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Program =require('./programModel')

const identitiesSchema = new mongoose.Schema({
  funame: { type: String, required: true },
  mail: { type: String, required: true },
  customRadio: { type: String, required: true },
  password: { type: String, required: true },
  profile: {
    about: String,
    occupation: String,
    profilePicture: {
      type: String,
      default: 'https://images.pexels.com/photos/19384488/pexels-photo-19384488/free-photo-of-a-woman-holding-an-old-camera-smiling.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  },
enrolled: [{
    program: {type: String,required: true},
    creator: { type: String, required: true}
},],
created:[{
    program:{type: String,required: true},
    creator:{type:String, required: true}
},],
goals: [
    {
        type: String,
    },
],
});

// Hash the password before saving it to the database
identitiesSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it has been modified or is new
    if (this.isModified('password') || this.isNew) {
      const hashedPassword = await bcrypt.hash(this.password, 10); // 10 is the number of salt rounds
      this.password = hashedPassword;
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
identitiesSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};


// Register

identitiesSchema.statics.registerNewUser = async function(userData) {
    // Validate and create new user
    const existingUser = await this.findOne({ mail: userData.mail });
    if (existingUser) {
        throw new Error("Email already in use.");
    }

    const newUser = new this(userData);
    await newUser.save();
    return newUser;
};

// Updating UserData
identitiesSchema.statics.updateUserDetails = async function(email, updateData) {
    const updatedUser = await this.findOneAndUpdate(
        { mail: email },
        { $set: updateData },
        { new: true }
    );
    if (!updatedUser) {
        throw new Error("User not found.");
    }
    return updatedUser;
};

identitiesSchema.statics.fetchUserProfile = async function(mail, role) {
    const user = await this.findOne({ mail, customRadio: role });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

identitiesSchema.statics.updateUserProfile = async function(mail, role, updateData) {
    const updatedUser = await this.findOneAndUpdate(
        { mail, customRadio: role },
        { $set: updateData },
        { new: true }
    );
    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
};
// Mentor Dealership

identitiesSchema.statics.deleteMentor = async function(email) {
    const mentor = await this.findOne({ mail: email, customRadio: 'Mentor' });
    if (!mentor) {
        throw new Error("Mentor not found.");
    }

    // Get the list of programs created by the mentor
    const createdPrograms = mentor.created;
    console.log("mentor Programs",createdPrograms)
    // If no programs are created, simply delete the mentor's identity
    if (createdPrograms.length === 0) {
        await this.deleteOne({ mail: email, customRadio: 'Mentor' });
        return; // Exit the function early since there are no programs to handle
    }

    // Delete these programs using Program model
    await Program.deleteMany({ program: { $in: createdPrograms.map(p => p.program) } });

    // Unenroll all users from these programs
    await this.updateMany(
        { 'enrolled.program': { $in: createdPrograms.map(p => p.program) } },
        { $pull: { enrolled: { program: { $in: createdPrograms.map(p => p.program) } } } }
    );

    // Delete the mentor's identity
    await this.deleteOne({ mail: email, customRadio: 'Mentor' });
};

identitiesSchema.statics.handleLogin = async function(email) {
    const user = await this.findOne({ mail: email});
    if (!user) {
        throw new Error('User not found');
    }
    return user.customRadio; 
};



const Identity = mongoose.model('Identity', identitiesSchema);

module.exports = Identity;
