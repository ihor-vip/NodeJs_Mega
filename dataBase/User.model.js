const { Schema, model } = require('mongoose');

const { userRolesEnum } = require('../constants');
const { authService } = require('../services');

const User = new Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, lowercase: true, unique: true, required: true },
  age: { type: Number, default: 18 },
  role: { type: String, enum: Object.values(userRolesEnum), default: userRolesEnum.USER },
  password: { type: String, required: true, default: null, select: false }
},
{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

User.virtual('fullName').get(function() {
  return this.name.toUpperCase()
});

User.statics = { // for schema // THIS - SCHEMA
  async saveUserWithHashPassword(userToSave) {
    const hashPassword = await authService.hashPassword(userToSave.password);

    return this.create({ ...userToSave, password: hashPassword });
  }
}

User.methods = { // for record // THIS - DOCUMENT
  checkIsPasswordsSame(password) {
    console.log(this);
    console.log(password);
  },

  toRepresentation() {
    delete this.password;

    return this;
  }
}

module.exports = model('User', User);
