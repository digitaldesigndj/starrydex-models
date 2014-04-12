var mongoose = require('mongoose');

var purchaseSchema = new mongoose.Schema({
  // email: { type: String, unique: true },

  url_hash: { type: String, default: '', unique: true },

  email: { type: String, default: '' },
  permalink: { type: String, default: '' },
  price: { type: String, default: '' },
  currency: { type: String, default: '' },
  
  claimed: { type: Boolean, default: false },
  // Locked to email address of registerd user?
  locked: { type: Boolean, default: false },
  test: { type: Boolean, default: false },
  full_name: { type: String, default: '' },

  // If Confirmed by GumRoad
  seller_id: { type: String, default: '' },
  product_id: { type: String, default: '' },
  product_name: { type: String, default: '' },
  permalink: { type: String, default: '' },
  product_permalink: { type: String, default: '' },
  email: { type: String, default: '' },
  price: { type: String, default: '' },
  currency: { type: String, default: '' },
  order_number: { type: String, default: '' },
  offer_code: { type: String, default: 'false' }

});

module.exports = mongoose.model('Donation', donationSchema);
