const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

const users = [
  {
    name: 'Admin User',
    email: 'admin@carrental.com',
    password: 'admin123',
    role: 'admin',
    phone: '9000000001',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user1234',
    role: 'user',
    phone: '9000000002',
  },
];

const cars = [
  {
    brand: 'Toyota',
    model: 'Fortuner',
    type: 'SUV',
    pricePerDay: 4500,
    seats: 7,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    year: 2022,
    mileage: 14,
    available: true,
    rating: 4.8,
    numReviews: 24,
    description: 'A powerful and spacious SUV perfect for long road trips and off-road adventures.',
    features: ['4WD', 'Sunroof', 'Leather Seats', 'Cruise Control', 'Bluetooth', 'Parking Sensors'],
    image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'Hyundai',
    model: 'Creta',
    type: 'SUV',
    pricePerDay: 2800,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    year: 2023,
    mileage: 16,
    available: true,
    rating: 4.6,
    numReviews: 38,
    description: 'The most popular compact SUV in India with great features and fuel efficiency.',
    features: ['Panoramic Sunroof', 'Android Auto', 'Apple CarPlay', 'Ventilated Seats', 'Blind Spot Monitor'],
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'Mahindra',
    model: 'Thar',
    type: 'SUV',
    pricePerDay: 3200,
    seats: 4,
    fuelType: 'Diesel',
    transmission: 'Manual',
    year: 2022,
    mileage: 15,
    available: true,
    rating: 4.7,
    numReviews: 19,
    description: 'The iconic off-road beast. Perfect for adventure seekers and rough terrain.',
    features: ['4x4', 'Convertible Top', 'Off-Road Tyres', 'Snorkel', 'Locking Differentials'],
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'Maruti',
    model: 'Swift',
    type: 'Hatchback',
    pricePerDay: 1200,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Manual',
    year: 2023,
    mileage: 23,
    available: true,
    rating: 4.3,
    numReviews: 52,
    description: 'Zippy, fuel-efficient hatchback ideal for city commutes and short trips.',
    features: ['Touchscreen Infotainment', 'Reverse Camera', 'Keyless Entry', 'Auto AC'],
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'Honda',
    model: 'City',
    type: 'Sedan',
    pricePerDay: 2000,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    year: 2022,
    mileage: 18,
    available: true,
    rating: 4.5,
    numReviews: 31,
    description: 'Premium sedan with a spacious interior, smooth ride, and excellent build quality.',
    features: ['Lane Watch', 'Honda Sensing', 'Wireless Charging', 'Sunroof', 'Ambient Lighting'],
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'Tata',
    model: 'Nexon EV',
    type: 'SUV',
    pricePerDay: 2500,
    seats: 5,
    fuelType: 'Electric',
    transmission: 'Automatic',
    year: 2023,
    mileage: 0,
    available: true,
    rating: 4.4,
    numReviews: 27,
    description: "India's best-selling electric SUV with a range of 312 km on a single charge.",
    features: ['312km Range', 'Fast Charging', 'Connected Car Tech', 'Harman Audio', 'Air Purifier'],
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'BMW',
    model: '3 Series',
    type: 'Sedan',
    pricePerDay: 8500,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    year: 2022,
    mileage: 16,
    available: true,
    rating: 4.9,
    numReviews: 14,
    description: 'The ultimate driving machine. Experience luxury and performance like never before.',
    features: ['M Sport Package', 'Heads-Up Display', 'Harman Kardon Audio', 'Gesture Control', 'Heated Seats'],
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'Kia',
    model: 'Seltos',
    type: 'SUV',
    pricePerDay: 2600,
    seats: 5,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    year: 2023,
    mileage: 17,
    available: true,
    rating: 4.5,
    numReviews: 33,
    description: 'Feature-loaded compact SUV with bold styling and a premium feel.',
    features: ['Bose Sound System', 'Ventilated Seats', 'Heads-Up Display', 'Drive Modes', 'ADAS'],
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'MG',
    model: 'Hector',
    type: 'SUV',
    pricePerDay: 3000,
    seats: 5,
    fuelType: 'Petrol',
    transmission: 'Manual',
    year: 2022,
    mileage: 15,
    available: true,
    rating: 4.3,
    numReviews: 21,
    description: "India's first internet car with a massive 14-inch touchscreen and loads of features.",
    features: ['14" Touchscreen', 'Panoramic Sunroof', 'i-SMART Connected Tech', '360 Camera', 'iHeater'],
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80',
  },
  {
    brand: 'Maruti',
    model: 'Ertiga',
    type: 'MPV',
    pricePerDay: 1800,
    seats: 7,
    fuelType: 'CNG',
    transmission: 'Manual',
    year: 2022,
    mileage: 26,
    available: true,
    rating: 4.2,
    numReviews: 44,
    description: 'The most economical 7-seater MPV, perfect for family trips on a budget.',
    features: ['CNG + Petrol', 'Rear AC Vents', 'Touchscreen', 'Cruise Control', 'Keyless Entry'],
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Booking.deleteMany({});
    await Car.deleteMany({});
    await User.deleteMany({});

    console.log('👤 Creating users (passwords will be hashed via pre-save hook)...');
    // ✅ Use User.create() one by one — triggers the pre('save') bcrypt hook
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`   ✅ Created user: ${user.email}`);
    }

    console.log('🚗 Creating cars...');
    const createdCars = await Car.insertMany(cars);
    console.log(`   ✅ Created ${createdCars.length} cars`);

    console.log('📅 Creating sample booking...');
    await Booking.create({
      user: createdUsers[1]._id,
      car: createdCars[0]._id,
      pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      returnDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalDays: 3,
      totalPrice: createdCars[0].pricePerDay * 3,
      status: 'confirmed',
      pickupLocation: 'Mumbai Airport',
      dropLocation: 'Mumbai Airport',
      paymentStatus: 'paid',
    });
    console.log(`   ✅ Sample booking created`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Demo Credentials:');
    console.log('   Admin → admin@carrental.com / admin123');
    console.log('   User  → john@example.com / user1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
    process.exit(1);
  }
};

seedDB();                                                           