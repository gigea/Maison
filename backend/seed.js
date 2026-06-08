/**
 * Database seeder
 * Run: npm run seed  (from /backend)
 *   or: node setup.js and choose Y when asked
 */
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('❌  MONGO_URI not set. Run node setup.js first.');
  process.exit(1);
}

const User    = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Classic White Oxford Shirt',
    description: 'A timeless white shirt crafted from 100% Egyptian cotton with a tailored fit. Perfect for both formal and casual wear.',
    price: 89, category: 'tops', gender: 'men',
    sizes: ['S','M','L','XL'],
    colors: [{ name:'White', hex:'#FFFFFF' }, { name:'Blue', hex:'#4A90D9' }],
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'],
    stock: 50, brand: 'Essentials', tags: ['shirt','formal','classic'], featured: true, rating: 4.5, numReviews: 12,
  },
  {
    name: 'Slim Fit Chino Pants',
    description: 'Modern slim-fit chinos in a comfortable stretch fabric. Versatile enough for the office or weekend outings.',
    price: 75, category: 'bottoms', gender: 'men',
    sizes: ['S','M','L','XL','XXL'],
    colors: [{ name:'Beige', hex:'#C8A882' }, { name:'Navy', hex:'#1A237E' }, { name:'Olive', hex:'#556B2F' }],
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'],
    stock: 40, brand: 'Essentials', tags: ['pants','chino','casual'], featured: false, rating: 4.2, numReviews: 8,
  },
  {
    name: 'Floral Wrap Dress',
    description: 'An elegant wrap dress featuring a vibrant floral print on lightweight chiffon. Flattering silhouette for all body types.',
    price: 120, salePrice: 89, category: 'dresses', gender: 'women',
    sizes: ['XS','S','M','L','XL'],
    colors: [{ name:'Floral Pink', hex:'#F48FB1' }],
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'],
    stock: 25, brand: 'Bloom', tags: ['dress','floral','summer'], featured: true, rating: 4.8, numReviews: 24,
  },
  {
    name: 'Oversized Hoodie',
    description: 'Ultra-soft oversized hoodie in premium fleece. The perfect cozy companion for cool days.',
    price: 65, category: 'tops', gender: 'unisex',
    sizes: ['XS','S','M','L','XL','XXL'],
    colors: [{ name:'Grey', hex:'#9E9E9E' }, { name:'Black', hex:'#212121' }, { name:'Cream', hex:'#FFF8E1' }],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600'],
    stock: 80, brand: 'UrbanBasics', tags: ['hoodie','casual','cozy'], featured: true, rating: 4.6, numReviews: 31,
  },
  {
    name: 'High-Waist Yoga Leggings',
    description: 'Performance leggings with 4-way stretch and moisture-wicking fabric. High waist for support and a flattering fit.',
    price: 55, category: 'bottoms', gender: 'women',
    sizes: ['XS','S','M','L','XL'],
    colors: [{ name:'Black', hex:'#212121' }, { name:'Navy', hex:'#1A237E' }],
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
    stock: 60, brand: 'ActiveWear', tags: ['leggings','activewear','yoga'], featured: false, rating: 4.7, numReviews: 45,
  },
  {
    name: 'Tailored Blazer',
    description: 'Sharp single-breasted blazer with a modern slim cut. An essential piece for building a versatile wardrobe.',
    price: 189, category: 'outerwear', gender: 'women',
    sizes: ['XS','S','M','L','XL'],
    colors: [{ name:'Black', hex:'#212121' }, { name:'Camel', hex:'#C19A6B' }],
    images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600'],
    stock: 20, brand: 'Atelier', tags: ['blazer','formal','workwear'], featured: true, rating: 4.4, numReviews: 16,
  },
  {
    name: 'Leather Belt',
    description: 'Full-grain leather belt with a brushed silver buckle. Handcrafted for durability and style.',
    price: 45, category: 'accessories', gender: 'unisex',
    sizes: ['S','M','L','XL'],
    colors: [{ name:'Brown', hex:'#795548' }, { name:'Black', hex:'#212121' }],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    stock: 100, brand: 'Essentials', tags: ['belt','leather','accessory'], featured: false, rating: 4.3, numReviews: 19,
  },
  {
    name: 'Canvas Sneakers',
    description: 'Classic low-top canvas sneakers with rubber soles. A wardrobe staple that goes with everything.',
    price: 69, category: 'shoes', gender: 'unisex',
    sizes: ['S','M','L','XL'],
    colors: [{ name:'White', hex:'#FFFFFF' }, { name:'Black', hex:'#212121' }, { name:'Navy', hex:'#1A237E' }],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    stock: 45, brand: 'UrbanBasics', tags: ['sneakers','shoes','casual'], featured: false, rating: 4.1, numReviews: 38,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB…');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✅  Connected\n');

    await User.deleteMany();
    await Product.deleteMany();

    const admin = await User.create({ name:'Admin', email:'admin@shop.com', password:'admin123', role:'admin' });
    const user  = await User.create({ name:'Jane Doe', email:'jane@example.com', password:'user123' });
    console.log(`✅  Users created`);
    console.log(`    Admin : admin@shop.com  /  admin123`);
    console.log(`    User  : jane@example.com  /  user123\n`);

    await Product.insertMany(products);
    console.log(`✅  ${products.length} products seeded\n`);

    console.log('🎉  Database ready. Run  npm run dev  to start the app.');
  } catch (err) {
    console.error('\n❌  Seeding failed:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.error('    MongoDB is not running. Start it first.\n');
    } else if (err.message.includes('Authentication failed')) {
      console.error('    Wrong username or password in your MONGO_URI.\n');
    } else if (err.message.includes('timed out')) {
      console.error('    Connection timed out. Check your MONGO_URI and network access (Atlas IP whitelist).\n');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
