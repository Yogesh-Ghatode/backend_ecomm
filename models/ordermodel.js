const mongoose = require('mongoose');
const Product = require("../models/productmodel");

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String},
    quantity: { type: Number, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
