# MAISON — Fashion E-Commerce

Fullstack fashion store — React + Node/Express + MongoDB.

---

## Quick Start (3 steps)

### Step 1 — Get a MongoDB database

**Option A: MongoDB Atlas (recommended, free)**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create free account
2. Create a free **M0** cluster
3. **Database Access** → Add user → set username + password
4. **Network Access** → Add `0.0.0.0/0` (allows all IPs)
5. **Connect** → Drivers → copy connection string:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/fashionshop
   ```

**Option B: Local MongoDB**
- Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Start it: `brew services start mongodb-community` (macOS) or `net start MongoDB` (Windows)
- URI: `mongodb://localhost:27017/fashionshop`

---

### Step 2 — Run the setup wizard

```bash
node setup.js
```

The wizard will:
- Ask for your MongoDB URI
- Generate a secure JWT secret
- Install all dependencies
- Seed sample products and users into your database

Or do it manually:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set MONGO_URI and JWT_SECRET
npm run install-all
npm run seed
```

---

### Step 3 — Start the app

```bash
npm run dev
```

| Service  | URL                          |
|----------|------------------------------|
| Shop     | http://localhost:3000        |
| API      | http://localhost:5000        |
| Health   | http://localhost:5000/api/health |

---

## Default accounts (after seeding)

| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | admin@shop.com     | admin123 |
| User  | jane@example.com   | user123  |

---

## Project structure

```
shop/
├── setup.js              ← Run this first
├── backend/
│   ├── .env              ← Your config (created by setup.js)
│   ├── .env.example      ← Template
│   ├── server.js         ← Express app + MongoDB connection
│   ├── seed.js           ← Populates sample data
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js       ← /api/auth
│   │   ├── products.js   ← /api/products
│   │   ├── orders.js     ← /api/orders
│   │   └── users.js      ← /api/users
│   └── middleware/
│       └── auth.js       ← JWT protect + admin guards
└── frontend/
    └── src/
        ├── App.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Products.jsx
        │   ├── ProductDetail.jsx
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── Auth.jsx
        │   ├── Orders.jsx
        │   ├── OrderDetail.jsx
        │   └── Admin.jsx       ← Add/edit/delete products
        └── utils/
            └── api.js          ← Axios instance with JWT
```

---

## Common errors

| Error | Fix |
|-------|-----|
| `MONGO_URI is not set` | Run `node setup.js` or create `backend/.env` |
| `connect ECONNREFUSED` | Local MongoDB not running — start `mongod` |
| `Authentication failed` | Wrong password in Atlas URI |
| `Connection timed out` | IP not whitelisted in Atlas Network Access |
| `Port 5000 in use` | Change `PORT=5001` in `.env` and update proxy in `frontend/package.json` |
| `npm run dev` not working | Run `npm install` in root folder first |

---

## Scripts

| Command | What it does |
|---------|-------------|
| `node setup.js` | Interactive setup wizard |
| `npm run dev` | Start frontend + backend together |
| `npm run seed` | Seed sample data into MongoDB |
| `npm run install-all` | Install all dependencies |
| `npm run build` | Build frontend for production |
