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

  steam: { type: String, default: '' },

  ip: { type: String, default: '' },
  loc: { type: String, default: '' },
  city: { type: String, default: '' },
  postal: { type: String, default: '' },
  region: { type: String, default: '' },
  country: { type: String, default: '' },
  hostname: { type: String, default: '' },

  alltime_votes: { type: String, default: '' },
  thismonth_votes: { type: String, default: '' },
  forum_posts: { type: String, default: '' },
  forum_rep: { type: String, default: '' },

  badges: { type: Array, default: ['recruit'] },

  forum: { type: String, default: '' },
  rank: { type: String, default: 'Recruit' },
  player: { type: String, default: '' },
  alt_characters: { type: String, default: '' },

  system_coords: { type: String, default: '' },
  system: Object,
  name: { type: String, default: '' },
  gender: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  picture: { type: String, default: '' },
  starbound_password: { type: String, default: '' },
  server_tokens: { type: Number, default: 0 },

  profile: {
    system: Object
  },

  donations: Array,
  donation_amount: { type: String, default: '0' },

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

module.exports = mongoose.model('Player', userSchema);
