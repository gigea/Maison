const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  salePrice:   { type: Number, default: null },
  category:    {
    type: String,
    required: true,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'accessories', 'shoes'],
  },
  gender:      { type: String, enum: ['men', 'women', 'unisex'], required: true },
  sizes:       [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
  colors:      [{ name: String, hex: String }],
  images:      [{ type: String }],
  stock:       { type: Number, required: true, default: 0 },
  brand:       { type: String, default: '' },
  tags:        [{ type: String }],
  reviews:     [reviewSchema],
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

// Auto-calculate average rating before save
productSchema.pre('save', function (next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
  next();
});

// Text search index
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
