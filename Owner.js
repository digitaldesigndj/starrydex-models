var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var ownerSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  owner: { type: Boolean, default: true }
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each owner.save() call.
 */

ownerSchema.pre('save', function(next) {
  var owner = this;

  if (!owner.isModified('password')) return next();

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(owner.password, salt, null, function(err, hash) {
      if (err) return next(err);
      owner.password = hash;
      next();
    });
  });
});

/**
 * Validate owner's password.
 * Used by Passport-Local Strategy for password validation.
 */

ownerSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Owner', ownerSchema);
