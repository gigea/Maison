const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  image:    { type: String },
  price:    { type: Number, required: true },
  size:     { type: String },
  color:    { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String },
    zip:     { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod:  { type: String, required: true, default: 'card' },
  paymentResult:  { isPaid: Boolean, paidAt: Date, transactionId: String },
  itemsPrice:     { type: Number, required: true },
  shippingPrice:  { type: Number, required: true, default: 0 },
  taxPrice:       { type: Number, required: true, default: 0 },
  totalPrice:     { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  isPaid:       { type: Boolean, default: false },
  paidAt:       Date,
  isDelivered:  { type: Boolean, default: false },
  deliveredAt:  Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
