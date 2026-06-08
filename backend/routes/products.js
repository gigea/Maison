const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// GET /api/products — list with filters, sort, pagination
router.get('/', async (req, res) => {
  try {
    const {
      keyword, category, gender, minPrice, maxPrice,
      size, color, brand, featured,
      sortBy = 'createdAt', order = 'desc',
      page = 1, limit = 12,
    } = req.query;

    const filter = { isActive: true };

    if (keyword)  filter.$text = { $search: keyword };
    if (category) filter.category = category;
    if (gender)   filter.gender   = gender;
    if (brand)    filter.brand    = new RegExp(brand, 'i');
    if (featured) filter.featured = featured === 'true';
    if (size)     filter.sizes    = { $in: size.split(',') };
    if (color)    filter['colors.name'] = { $in: color.split(',') };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortObj = { [sortBy]: order === 'asc' ? 1 : -1 };
    const skip    = (Number(page) - 1) * Number(limit);
    const total   = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/recent?ids=123,456
router.get('/recent', async (req, res) => {
  try {
    const ids = (req.query.ids || '').split(',').filter(Boolean);
    const products = await Product.find({ _id: { $in: ids }, isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — admin only
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id — admin only (soft delete)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
