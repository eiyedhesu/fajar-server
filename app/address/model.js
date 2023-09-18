const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const shippingAddressSchema = new Schema({
  provinsi: String,
  kabupaten: String,
  kecamatan: String,
  kelurahan: String,
  detail: String,
});

const ShippingAddress = model('ShippingAddress', shippingAddressSchema);

module.exports = ShippingAddress;
