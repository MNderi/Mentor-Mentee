

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const managersSchema = new mongoose.Schema({
  funame: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'manager' },
});

managersSchema.pre('save', async function (next) {
    try {
      if (this.isModified('password') || this.isNew) {
        const hashedPassword = await bcrypt.hash(this.password, 10); // 10 is the number of salt rounds
        this.password = hashedPassword;
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
  managersSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  

  const Manager = mongoose.model('Manager', managersSchema);


module.exports = { Manager };
