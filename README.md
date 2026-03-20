# 🚗 DriveWay — MERN Stack Car Rental System

A production-ready, full-stack car rental platform built with MongoDB, Express.js, React.js, and Node.js.

![DriveWay](https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

### Frontend
- 🏠 **Hero Landing Page** with search, stats, featured cars, how-it-works
- 🚗 **Cars Listing** with advanced filters (brand, type, fuel, price, seats, availability)
- 🔍 **Search & Sort** with real-time filtering and pagination
- 📄 **Car Detail Page** with specs, features, ratings, and inline booking CTA
- 📅 **Booking Flow** with date picker, price calculator, location selection
- 👤 **User Dashboard** — booking history, status tracking, profile editor
- 👑 **Admin Dashboard** — full CRUD cars, manage bookings, upload images
- 🔐 **Auth Pages** — login with demo credentials, register with password strength meter
- 📱 **Fully Responsive** — mobile-first Tailwind CSS design
- 🎨 **Dark Theme** with orange accent — modern, clean UI
- ⚡ **Loading Skeletons** — smooth UX during data fetching
- 🍞 **Toast Notifications** — success/error feedback throughout

### Backend
- 🔐 **JWT Authentication** with bcrypt password hashing
- 🛡️ **Protected Routes** — user + admin middleware
- 🚗 **Car CRUD API** with filtering, sorting, pagination, full-text search
- 📋 **Booking API** — create, cancel, status update, conflict detection
- 📸 **ImageKit Integration** for cloud image uploads
- ✅ **Input Validation** and comprehensive error handling
- 🌱 **Database Seeder** with 10 sample cars + demo users

---

## 🗂️ Project Structure

```
car-rental-system/
├── package.json                  ← Root scripts (monorepo)
│
├── client/                       ← React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── CarCard.js
│   │   │   ├── BookingCard.js
│   │   │   ├── SearchFilters.js
│   │   │   ├── Loader.js
│   │   │   ├── Modal.js
│   │   │   ├── Pagination.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── AdminRoute.js
│   │   │   └── ScrollToTop.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── CarsPage.js
│   │   │   ├── CarDetailPage.js
│   │   │   ├── BookingPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── AdminDashboardPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── NotFoundPage.js
│   │   ├── services/
│   │   │   ├── api.js            ← Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── carService.js
│   │   │   └── bookingService.js
│   │   ├── context/
│   │   │   └── AuthContext.js    ← Global auth state
│   │   ├── hooks/
│   │   │   ├── useCars.js
│   │   │   └── useBookings.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css             ← Tailwind + custom styles
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── server/                       ← Node.js Backend
    ├── config/
    │   ├── db.js                 ← MongoDB connection
    │   └── imagekit.js           ← ImageKit config
    ├── controllers/
    │   ├── authController.js
    │   ├── carController.js
    │   ├── bookingController.js
    │   └── uploadController.js
    ├── middleware/
    │   ├── authMiddleware.js     ← JWT protect + adminOnly
    │   ├── errorMiddleware.js
    │   └── uploadMiddleware.js   ← Multer config
    ├── models/
    │   ├── User.js
    │   ├── Car.js
    │   └── Booking.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── carRoutes.js
    │   ├── bookingRoutes.js
    │   └── uploadRoutes.js
    ├── utils/
    │   ├── generateToken.js
    │   └── seeder.js             ← Sample data seed script
    ├── .env.example
    └── server.js
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MongoDB | ≥ 6.x (local) or MongoDB Atlas |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/car-rental-system.git
cd car-rental-system
```

### 2. Install All Dependencies

```bash
npm run install-all
```

Or manually:
```bash
# Root
npm install

# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 3. Configure Environment Variables

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/car-rental-system
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d

# Optional — ImageKit for image uploads
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

NODE_ENV=development
```

> **MongoDB Atlas:** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://user:password@cluster.mongodb.net/car-rental-system`

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- **10 sample cars** (Toyota Fortuner, Hyundai Creta, Mahindra Thar, etc.)
- **Admin account:** `admin@carrental.com` / `admin123`
- **User account:** `john@example.com` / `user1234`
- **1 sample booking**

### 5. Run the Application

```bash
# Start both server + client concurrently
npm run dev
```

| Service | URL |
|---------|-----|
| React Frontend | http://localhost:3000 |
| Express API | http://localhost:5000 |
| API Health Check | http://localhost:5000/ |

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@carrental.com | admin123 |
| User | john@example.com | user1234 |

---

## 📡 API Reference

### Auth Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/profile` | Private | Get current user profile |
| PUT | `/api/auth/profile` | Private | Update profile |
| GET | `/api/auth/users` | Admin | Get all users |

### Car Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cars` | Public | List cars (filters, pagination) |
| GET | `/api/cars/featured` | Public | Get top 6 featured cars |
| GET | `/api/cars/:id` | Public | Get single car |
| POST | `/api/cars` | Admin | Create new car |
| PUT | `/api/cars/:id` | Admin | Update car |
| DELETE | `/api/cars/:id` | Admin | Delete car |

#### Car Query Parameters

```
GET /api/cars?brand=Toyota&type=SUV&fuelType=Diesel&minPrice=2000&maxPrice=5000
              &seats=7&available=true&search=fortuner
              &sort=-pricePerDay&page=1&limit=9
```

### Booking Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | Private | Create booking |
| GET | `/api/bookings` | Admin | Get all bookings |
| GET | `/api/bookings/user` | Private | Get user's bookings |
| GET | `/api/bookings/:id` | Private | Get single booking |
| DELETE | `/api/bookings/:id` | Private | Cancel booking |
| PUT | `/api/bookings/:id/status` | Admin | Update booking status |

### Upload Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/upload` | Admin | Upload image to ImageKit |
| GET | `/api/upload/auth` | Admin | Get ImageKit auth params |

---

## 🗄️ Database Schemas

### User
```js
{ name, email, password (hashed), role: ['user','admin'], phone, avatar, timestamps }
```

### Car
```js
{ brand, model, type, pricePerDay, seats, fuelType, transmission,
  image, imageFileId, available, year, mileage, description,
  features[], rating, numReviews, timestamps }
```

### Booking
```js
{ user (ref), car (ref), pickupDate, returnDate, totalDays, totalPrice,
  status: ['pending','confirmed','active','completed','cancelled'],
  pickupLocation, dropLocation, paymentStatus, notes, timestamps }
```

---

## 🧪 API Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carrental.com","password":"admin123"}'

# Get cars
curl http://localhost:5000/api/cars?type=SUV&available=true

# Create booking (replace TOKEN)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"carId":"CAR_ID","pickupDate":"2024-12-20","returnDate":"2024-12-25"}'
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Tailwind CSS 3, Custom CSS |
| State | Context API + useReducer |
| HTTP | Axios with interceptors |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT + bcryptjs |
| Images | ImageKit API + Multer |
| Notifications | react-hot-toast |
| Dev Tools | nodemon, concurrently |

---

## 🔧 Individual Scripts

```bash
# Server only
cd server && npm run dev

# Client only
cd client && npm start

# Build client for production
cd client && npm run build

# Re-seed database
cd server && npm run seed

# Start production server
npm start
```

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)
1. Build: `cd client && npm run build`
2. Deploy the `client/build` folder
3. Set env variable: `REACT_APP_API_URL=https://your-api.com/api`

### Backend (Railway / Render / Heroku)
1. Set all environment variables in the dashboard
2. Start command: `node server.js`
3. Ensure MongoDB Atlas URI is set

---

## 📸 ImageKit Setup (Optional)

1. Create a free account at [imagekit.io](https://imagekit.io)
2. Copy your Public Key, Private Key, and URL Endpoint
3. Add them to `server/.env`
4. Admin can now upload car images via the dashboard

> Without ImageKit, use direct image URLs in the car form.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use and modify.

---

<div align="center">
  Built with ❤️ using the MERN Stack
</div>
