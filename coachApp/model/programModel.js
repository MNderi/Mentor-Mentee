const mongoose= require('mongoose');


const programsSchema = new mongoose.Schema({
    // Define the fields for program model
    // For example:
    program: { type: String, required: true },
    date:{type: Date,required:true},
    endDate:{type: Date,required:true},
    venue:{type: String, required:true},
    description:{type: String},
    category:{type:String},
    creator:{type: String, required:true},
    numberEnrolled: {
      type: Number,
      default: 0,
    },
    goals: { type: String },
    skills: { type: String },
    projection: { type: String },   
  });
  


programsSchema.statics.findProgramsByCreator = async function(creatorName) {
    const programs = await this.find({ creator: creatorName });
    return programs;
};

  // Create the program model
  const Program = mongoose.model('Program', programsSchema);
  
  module.exports = Program;