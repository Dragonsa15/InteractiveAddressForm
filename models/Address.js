var mongoose   = require('mongoose');

var AddressSchema = new mongoose.Schema ({
    latitude: String,
    longitude: String,
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Address',AddressSchema);
