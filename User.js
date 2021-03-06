var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  linkedin: String,
  tokens: Array,
  server: { type: Number, default: 0 },
  purchases: Array,
  destoryed_servers: Array,
  special_redeemed: { type: Boolean, default: false }, // db.users.update({},{$set : {"special_redeemed":false}},false,true)
  port: { type: Number, default: 21025 },
  starrypy: { type: Boolean, default: false },
  uuid: { type: String, default: '' },

  // All Time Used Tokens, Added upon destroy
  used_tokens: { type: Number, default: 0 },
  // Tokens used on current server
  current_server_used_tokens: { type: Number, default: 0 },
  // Count of users tokens
  server_tokens: { type: Number, default: 0 },
  // Keeps a total of server time
  billed_seconds: { type: Number, default: 0 },

  starbound_password: { type: String, default: '' },
  starbound_maxplayers: { type: Number, default: 8 },

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */

userSchema.methods.gravatar = function(size, defaults) {
  if (!size) size = 200;
  if (!defaults) defaults = 'retro';

  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=' + defaults;
  }

  var md5 = crypto.createHash('md5').update(this.email);
  return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

module.exports = mongoose.model('User', userSchema);
