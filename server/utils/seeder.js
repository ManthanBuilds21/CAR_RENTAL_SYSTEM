// ============================================================
//  seeder.js
//  Path: server/utils/seeder.js
//  Run: npm run seed  (from /server)
//  Deletes ALL existing vehicles and seeds 130 new ones.
//
//  Valid types:   Sedan | SUV | Hatchback | MUV | Luxury | Convertible | Pickup
//  Valid fuels:   Petrol | Diesel | Electric | Hybrid | CNG
//  Valid trans:   Manual | Automatic
// ============================================================

const mongoose = require('mongoose');
const Car      = require('../models/Car');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/car_rental';

const vehicles = [

  // ═══════════════════════════════════════════════════════════
  //  HATCHBACKS — 15 cars (budget friendly ₹750–₹1200/day)
  // ═══════════════════════════════════════════════════════════
  {
    brand:'Maruti', model:'Alto K10', year:2023, type:'Hatchback',
    pricePerDay:750, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.1, numReviews:42,
    image:'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80',
    description:'India\'s best-selling budget car. Excellent fuel efficiency and easy to drive in city traffic.',
    features:['AC','Power Steering','Central Locking','Music System'],
  },
  {
    brand:'Maruti', model:'S-Presso', year:2023, type:'Hatchback',
    pricePerDay:850, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.0, numReviews:31,
    image:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format&fit=crop&q=80',
    description:'Mini-SUV styled hatchback with tall boy design and good ground clearance.',
    features:['AC','Touchscreen','Rear Camera','Keyless Entry'],
  },
  {
    brand:'Maruti', model:'WagonR', year:2024, type:'Hatchback',
    pricePerDay:900, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:58,
    image:'https://images.unsplash.com/photo-1609752048665-f5c4ac85e3f8?w=600&auto=format&fit=crop&q=80',
    description:'Spacious and practical hatchback perfect for family weekend trips.',
    features:['AC','Power Windows','Central Locking','USB Charging'],
  },
  {
    brand:'Maruti', model:'Swift', year:2024, type:'Hatchback',
    pricePerDay:1000, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.5, numReviews:87,
    image:'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format&fit=crop&q=80',
    description:'Sporty hatchback with peppy engine. Great for both city and highway drives.',
    features:['AC','Touchscreen','Apple CarPlay','Rear Camera','Cruise Control'],
  },
  {
    brand:'Maruti', model:'Swift AMT', year:2024, type:'Hatchback',
    pricePerDay:1100, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:61,
    image:'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80',
    description:'Automatic variant of the popular Swift. No gear stress in city traffic.',
    features:['AC','Touchscreen','Apple CarPlay','Rear Camera','Auto Gear Shift'],
  },
  {
    brand:'Hyundai', model:'Grand i10 Nios', year:2023, type:'Hatchback',
    pricePerDay:950, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.2, numReviews:44,
    image:'https://images.unsplash.com/photo-1625231338898-6b4c358d8b71?w=600&auto=format&fit=crop&q=80',
    description:'Premium features at an affordable price. Comfortable and reliable daily driver.',
    features:['AC','Wireless Charging','Rear Camera','Voice Assistant'],
  },
  {
    brand:'Hyundai', model:'i20', year:2024, type:'Hatchback',
    pricePerDay:1200, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:63,
    image:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
    description:'Feature-loaded premium hatchback with sporty looks and connected car tech.',
    features:['AC','Sunroof','BlueLink Connected','Bose Sound System','Lane Assist'],
  },
  {
    brand:'Tata', model:'Tiago', year:2023, type:'Hatchback',
    pricePerDay:900, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.2, numReviews:39,
    image:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&auto=format&fit=crop&q=80',
    description:'Safe, stylish and affordable hatchback with 5-star GNCAP safety rating.',
    features:['AC','Touchscreen','Rear Camera','Dual Airbags','ABS'],
  },
  {
    brand:'Tata', model:'Tiago EV', year:2024, type:'Hatchback',
    pricePerDay:1100, seats:5, transmission:'Automatic', fuelType:'Electric',
    available:true, rating:4.6, numReviews:29,
    image:'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=80',
    description:'India\'s most affordable electric hatchback with 250km range.',
    features:['AC','Fast Charging','Regenerative Braking','Connected Car Tech','Touchscreen'],
  },
  {
    brand:'Renault', model:'Kwid', year:2023, type:'Hatchback',
    pricePerDay:800, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.0, numReviews:35,
    image:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&auto=format&fit=crop&q=80',
    description:'SUV-inspired budget hatchback with excellent ground clearance.',
    features:['AC','Touchscreen','Digital Cluster','Rear Camera'],
  },
  {
    brand:'Volkswagen', model:'Polo', year:2022, type:'Hatchback',
    pricePerDay:1200, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:37,
    image:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    description:'German-engineered premium hatchback with solid build quality and refined ride.',
    features:['AC','Touchscreen','Cruise Control','Rear Camera','LED Lights'],
  },
  {
    brand:'Honda', model:'Jazz', year:2022, type:'Hatchback',
    pricePerDay:1100, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:28,
    image:'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
    description:'Premium hatchback with Magic Seat layout and spacious cabin.',
    features:['AC','Magic Seats','Honda Sensing','Apple CarPlay','Sunroof'],
  },
  {
    brand:'Toyota', model:'Glanza', year:2024, type:'Hatchback',
    pricePerDay:1000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:33,
    image:'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80',
    description:'Toyota reliability in a premium hatchback. Great resale value.',
    features:['AC','Sunroof','Touchscreen','Rear Camera','Toyota Safety Sense'],
  },
  {
    brand:'Skoda', model:'Fabia', year:2022, type:'Hatchback',
    pricePerDay:1150, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.2, numReviews:19,
    image:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&auto=format&fit=crop&q=80',
    description:'European premium hatchback with refined interior and TSI engine.',
    features:['AC','Virtual Cockpit','Wireless Charging','Canton Sound'],
  },
  {
    brand:'Datsun', model:'GO Plus', year:2022, type:'Hatchback',
    pricePerDay:750, seats:7, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:3.9, numReviews:22,
    image:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80',
    description:'Ultra-affordable 7-seater hatchback. Best value for large families.',
    features:['AC','Power Steering','Central Locking','Third Row Seats'],
  },

  // ═══════════════════════════════════════════════════════════
  //  SEDANS — 15 cars (budget to mid-range ₹1100–₹2800/day)
  // ═══════════════════════════════════════════════════════════
  {
    brand:'Maruti', model:'Dzire', year:2024, type:'Sedan',
    pricePerDay:1300, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:72,
    image:'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&auto=format&fit=crop&q=80',
    description:'India\'s best-selling compact sedan. Smooth ride, great mileage.',
    features:['AC','Touchscreen','Apple CarPlay','Rear Camera','Auto Headlamps'],
  },
  {
    brand:'Hyundai', model:'Aura', year:2023, type:'Sedan',
    pricePerDay:1200, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.2, numReviews:41,
    image:'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=80',
    description:'Stylish compact sedan with turbo engine option and connected features.',
    features:['AC','Wireless Charging','BlueLink','Voice Commands','Rear Camera'],
  },
  {
    brand:'Honda', model:'Amaze', year:2024, type:'Sedan',
    pricePerDay:1400, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:55,
    image:'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=80',
    description:'Reliable compact sedan with smooth CVT automatic transmission.',
    features:['AC','LaneWatch Camera','Touchscreen','Honda Connect','Sunroof'],
  },
  {
    brand:'Tata', model:'Tigor', year:2023, type:'Sedan',
    pricePerDay:1100, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.1, numReviews:33,
    image:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=80',
    description:'Safe compact sedan with coupe-like styling and practical boot space.',
    features:['AC','Touchscreen','Rear Camera','Dual Airbags','ABS+EBD'],
  },
  {
    brand:'Tata', model:'Tigor EV', year:2024, type:'Sedan',
    pricePerDay:1300, seats:5, transmission:'Automatic', fuelType:'Electric',
    available:true, rating:4.5, numReviews:27,
    image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80',
    description:'Electric compact sedan with 315km range. Perfect for eco-conscious travelers.',
    features:['AC','Fast Charging','Connected Tech','Touchscreen','Regenerative Braking'],
  },
  {
    brand:'Honda', model:'City', year:2024, type:'Sedan',
    pricePerDay:2200, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.6, numReviews:91,
    image:'https://images.unsplash.com/photo-1555353540-64580b51c258?w=600&auto=format&fit=crop&q=80',
    description:'India\'s most loved mid-size sedan. Spacious cabin, refined ride quality.',
    features:['AC','Sunroof','Honda Sensing','LaneWatch','Touchscreen','Apple CarPlay'],
  },
  {
    brand:'Maruti', model:'Ciaz', year:2023, type:'Sedan',
    pricePerDay:1800, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:48,
    image:'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=600&auto=format&fit=crop&q=80',
    description:'Premium mid-size sedan with plush interiors and comfortable long-distance ride.',
    features:['AC','Sunroof','Rear AC Vents','Touchscreen','Cruise Control'],
  },
  {
    brand:'Hyundai', model:'Verna', year:2024, type:'Sedan',
    pricePerDay:2500, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.7, numReviews:76,
    image:'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
    description:'Premium sedan with Level 2 ADAS, panoramic sunroof and Bose audio.',
    features:['Panoramic Sunroof','ADAS','Bose Sound','Ventilated Seats','HUD'],
  },
  {
    brand:'Skoda', model:'Slavia', year:2024, type:'Sedan',
    pricePerDay:2800, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.5, numReviews:38,
    image:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&auto=format&fit=crop&q=80',
    description:'European-engineered sedan with sporty TSI engine and premium interiors.',
    features:['AC','Virtual Cockpit','Sunroof','Laura Sound','Wireless Charging'],
  },
  {
    brand:'Volkswagen', model:'Virtus', year:2024, type:'Sedan',
    pricePerDay:2600, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:42,
    image:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    description:'German engineered compact sedan with peppy turbo engine.',
    features:['AC','IQ.Drive','Sunroof','VW Play App','Wireless Charging'],
  },
  {
    brand:'Toyota', model:'Yaris', year:2022, type:'Sedan',
    pricePerDay:1500, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:29,
    image:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&auto=format&fit=crop&q=80',
    description:'Reliable Japanese sedan with 7 airbags and excellent build quality.',
    features:['AC','7 Airbags','Touchscreen','Rear Camera','Cruise Control'],
  },
  {
    brand:'Honda', model:'City Hybrid', year:2024, type:'Sedan',
    pricePerDay:2500, seats:5, transmission:'Automatic', fuelType:'Hybrid',
    available:true, rating:4.7, numReviews:34,
    image:'https://images.unsplash.com/photo-1580310614729-ccd69652491d?w=600&auto=format&fit=crop&q=80',
    description:'Hybrid sedan with 26 km/l efficiency and premium Honda Sensing ADAS.',
    features:['AC','Strong Hybrid','Honda Sensing','LaneWatch','Sunroof','Wireless Charging'],
  },
  {
    brand:'Nissan', model:'Sunny', year:2022, type:'Sedan',
    pricePerDay:1100, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.0, numReviews:18,
    image:'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format&fit=crop&q=80',
    description:'Spacious and affordable sedan with best-in-class legroom.',
    features:['AC','Touchscreen','Rear Camera','Central Locking'],
  },
  {
    brand:'Hyundai', model:'Elantra', year:2022, type:'Sedan',
    pricePerDay:2000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:25,
    image:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&auto=format&fit=crop&q=80',
    description:'Parametric dynamics design sedan with premium features.',
    features:['AC','Sunroof','Bose Sound','Wireless Charging','BlueLink ADAS'],
  },
  {
    brand:'Kia', model:'K3', year:2022, type:'Sedan',
    pricePerDay:1800, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:16,
    image:'https://images.unsplash.com/photo-1625231338898-6b4c358d8b71?w=600&auto=format&fit=crop&q=80',
    description:'Sporty compact sedan with premium interior and connected features.',
    features:['AC','Sunroof','Bose Sound','Wireless Charging','Rear Camera'],
  },

  // ═══════════════════════════════════════════════════════════
  //  SUVs — 20 cars (budget to premium ₹1200–₹8000/day)
  // ═══════════════════════════════════════════════════════════
  {
    brand:'Maruti', model:'Brezza', year:2024, type:'SUV',
    pricePerDay:1500, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:69,
    image:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format&fit=crop&q=80',
    description:'India\'s top-selling compact SUV. Perfect blend of style, space and efficiency.',
    features:['AC','Sunroof','Heads Up Display','360 Camera','Apple CarPlay'],
  },
  {
    brand:'Hyundai', model:'Venue', year:2024, type:'SUV',
    pricePerDay:1600, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:57,
    image:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80',
    description:'Connected compact SUV with Blue Link tech and sporty styling.',
    features:['AC','BlueLink Connected','Bose Sound','Sunroof','TPMS'],
  },
  {
    brand:'Tata', model:'Nexon', year:2024, type:'SUV',
    pricePerDay:1700, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.5, numReviews:84,
    image:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&auto=format&fit=crop&q=80',
    description:'5-star GNCAP rated compact SUV. Safest car in its segment.',
    features:['AC','Sunroof','JBL Sound','360 Camera','Terrain Modes'],
  },
  {
    brand:'Tata', model:'Nexon EV', year:2024, type:'SUV',
    pricePerDay:2000, seats:5, transmission:'Automatic', fuelType:'Electric',
    available:true, rating:4.7, numReviews:52,
    image:'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=80',
    description:'India\'s best-selling electric SUV with 465km range.',
    features:['AC','Fast DC Charging','Vehicle-to-Load','Sunroof','ADAS'],
  },
  {
    brand:'Kia', model:'Sonet', year:2024, type:'SUV',
    pricePerDay:1800, seats:5, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.5, numReviews:61,
    image:'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&auto=format&fit=crop&q=80',
    description:'Premium compact SUV with a large feature list and sporty design.',
    features:['AC','Sunroof','Bose Sound','360 Camera','ADAS Level 1'],
  },
  {
    brand:'Renault', model:'Kiger', year:2023, type:'SUV',
    pricePerDay:1300, seats:5, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.1, numReviews:34,
    image:'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80',
    description:'Affordable compact SUV with turbo engine and good ground clearance.',
    features:['AC','Touchscreen','Rear Camera','Multi Sense Drive Modes'],
  },
  {
    brand:'Nissan', model:'Magnite', year:2023, type:'SUV',
    pricePerDay:1200, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.0, numReviews:28,
    image:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80',
    description:'Value-packed compact SUV with turbo CVT option and 360 camera.',
    features:['AC','Touchscreen','360 Around View Camera','Ambient Lighting'],
  },
  {
    brand:'Mahindra', model:'XUV 3XO', year:2024, type:'SUV',
    pricePerDay:1900, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.6, numReviews:47,
    image:'https://images.unsplash.com/photo-1537984822441-cff330075342?w=600&auto=format&fit=crop&q=80',
    description:'Feature-packed compact SUV with panoramic sunroof and ADAS.',
    features:['Panoramic Sunroof','ADAS','Harman Sound','AdrenoX Connect','Wireless Charging'],
  },
  {
    brand:'Hyundai', model:'Creta', year:2024, type:'SUV',
    pricePerDay:2500, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.7, numReviews:112,
    image:'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&auto=format&fit=crop&q=80',
    description:'India\'s favourite mid-size SUV with panoramic sunroof and Level 2 ADAS.',
    features:['Panoramic Sunroof','ADAS Level 2','Bose Sound','360 Camera','HUD','Ventilated Seats'],
  },
  {
    brand:'Kia', model:'Seltos', year:2024, type:'SUV',
    pricePerDay:2800, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.6, numReviews:94,
    image:'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=600&auto=format&fit=crop&q=80',
    description:'Segment-leading mid-size SUV with impressive features and powerful engine.',
    features:['Panoramic Sunroof','Bose Sound','ADAS','360 Camera','HUD'],
  },
  {
    brand:'Mahindra', model:'Scorpio N', year:2024, type:'SUV',
    pricePerDay:3000, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.5, numReviews:67,
    image:'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
    description:'Rugged 7-seater SUV with ladder frame chassis. Perfect for adventure trips.',
    features:['AC','4x4 Drive','Terrain Modes','Sony Sound','Sunroof','Wireless Charging'],
  },
  {
    brand:'Tata', model:'Harrier', year:2024, type:'SUV',
    pricePerDay:3200, seats:5, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.6, numReviews:58,
    image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
    description:'Premium 5-seater SUV with Omega Arc architecture and ADAS features.',
    features:['Panoramic Sunroof','ADAS','JBL Sound','360 Camera','Air Purifier'],
  },
  {
    brand:'Mahindra', model:'XUV700', year:2024, type:'SUV',
    pricePerDay:4000, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.8, numReviews:88,
    image:'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&auto=format&fit=crop&q=80',
    description:'Flagship SUV with ADAS Level 2, sky roof and best-in-class features.',
    features:['Sky Roof','ADAS Level 2','Sony 3D Sound','AdrenoX','Wireless Charging'],
  },
  {
    brand:'Toyota', model:'Urban Cruiser Hyryder', year:2024, type:'SUV',
    pricePerDay:2600, seats:5, transmission:'Automatic', fuelType:'Hybrid',
    available:true, rating:4.5, numReviews:43,
    image:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=80',
    description:'Hybrid SUV with excellent fuel economy and Toyota reliability.',
    features:['AC','Strong Hybrid','Sunroof','Toyota Safety Sense','Wireless Charging'],
  },
  {
    brand:'Toyota', model:'Fortuner', year:2024, type:'SUV',
    pricePerDay:5500, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.8, numReviews:103,
    image:'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80',
    description:'Legendary 7-seater ladder-frame SUV. Capable on any terrain.',
    features:['4x4 Drive','Terrain Select','JBL Sound','360 Camera','HUD','Wireless Charging'],
  },
  {
    brand:'MG', model:'Gloster', year:2023, type:'SUV',
    pricePerDay:5500, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.5, numReviews:31,
    image:'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=600&auto=format&fit=crop&q=80',
    description:'Flagship full-size SUV with captain seats, ADAS and premium features.',
    features:['4x4','ADAS','Captain Seats','360 Camera','Wireless Charging'],
  },
  {
    brand:'Jeep', model:'Meridian', year:2024, type:'SUV',
    pricePerDay:6500, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.6, numReviews:29,
    image:'https://images.unsplash.com/photo-1625231338898-6b4c358d8b71?w=600&auto=format&fit=crop&q=80',
    description:'American icon in a 7-seater SUV avatar. Trail-rated for any adventure.',
    features:['4x4','Jeep Safety Tec','Uconnect 5','Alpine Sound','Ventilated Seats'],
  },
  {
    brand:'Skoda', model:'Kushaq', year:2024, type:'SUV',
    pricePerDay:2700, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:41,
    image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    description:'Czech-engineered compact SUV with MQB-A0-IN platform and punchy TSI engine.',
    features:['AC','Sunroof','Virtual Cockpit','Canton Sound','Wireless Charging'],
  },
  {
    brand:'Volkswagen', model:'Taigun', year:2024, type:'SUV',
    pricePerDay:2600, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:36,
    image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
    description:'German precision in a compact SUV package with turbo TSI engine.',
    features:['AC','Sunroof','IQ.Drive ADAS','VW Play','Wireless Charging'],
  },
  {
    brand:'Ford', model:'EcoSport', year:2022, type:'SUV',
    pricePerDay:1600, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.2, numReviews:46,
    image:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
    description:'Rugged compact SUV with EcoBoost engine and Ford SYNC infotainment.',
    features:['AC','Ford SYNC','Rear Camera','Rain Sensing Wipers','Sunroof'],
  },

  // ═══════════════════════════════════════════════════════════
  //  MUV (Multi-Utility Vehicles) — 10 cars ₹1800–₹4500/day
  // ═══════════════════════════════════════════════════════════
  {
    brand:'Maruti', model:'Ertiga', year:2024, type:'MUV',
    pricePerDay:1800, seats:7, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:66,
    image:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80',
    description:'India\'s top-selling 7-seater MPV. Perfect for family road trips.',
    features:['AC','Touchscreen','Rear AC','Apple CarPlay','Sliding Doors'],
  },
  {
    brand:'Maruti', model:'XL6', year:2024, type:'MUV',
    pricePerDay:2000, seats:6, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.3, numReviews:38,
    image:'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&auto=format&fit=crop&q=80',
    description:'Premium 6-seater MPV with captain seats and sporty Nexa design.',
    features:['AC','Captain Seats','Sunroof','Touchscreen','Wireless Charging'],
  },
  {
    brand:'Kia', model:'Carens', year:2024, type:'MUV',
    pricePerDay:2200, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.5, numReviews:54,
    image:'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&auto=format&fit=crop&q=80',
    description:'Recreation Vehicle for families with panoramic sunroof and premium features.',
    features:['Panoramic Sunroof','Bose Sound','ADAS','Wireless Charging','6 Airbags'],
  },
  {
    brand:'Toyota', model:'Innova Crysta', year:2023, type:'MUV',
    pricePerDay:3500, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.8, numReviews:119,
    image:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&auto=format&fit=crop&q=80',
    description:'The gold standard of Indian MPVs. Ultra-reliable and supremely comfortable.',
    features:['AC','Captain Seats','Rear Entertainment','JBL Sound','Wireless Charging'],
  },
  {
    brand:'Toyota', model:'Innova HyCross', year:2024, type:'MUV',
    pricePerDay:4500, seats:7, transmission:'Automatic', fuelType:'Hybrid',
    available:true, rating:4.9, numReviews:77,
    image:'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&auto=format&fit=crop&q=80',
    description:'Hybrid MPV with panoramic roof, ottoman seats and 23 km/l efficiency.',
    features:['Strong Hybrid','Panoramic Roof','Ottoman Seats','JBL 9-Speaker','ADAS'],
  },
  {
    brand:'Mahindra', model:'Marazzo', year:2022, type:'MUV',
    pricePerDay:2200, seats:8, transmission:'Manual', fuelType:'Diesel',
    available:true, rating:4.2, numReviews:28,
    image:'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80',
    description:'Shark-inspired 8-seater MPV with best-in-class NVH levels.',
    features:['AC','Touchscreen','Rear Camera','Roof-Mounted AC'],
  },
  {
    brand:'Hyundai', model:'Stargazer', year:2024, type:'MUV',
    pricePerDay:2400, seats:7, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.4, numReviews:21,
    image:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80',
    description:'Premium MPV with relaxed ride, sliding doors and smart connectivity.',
    features:['AC','Sliding Doors','BlueLink','Rear AC Vents','Wireless Charging'],
  },
  {
    brand:'Renault', model:'Triber', year:2023, type:'MUV',
    pricePerDay:1400, seats:7, transmission:'Manual', fuelType:'Petrol',
    available:true, rating:4.1, numReviews:32,
    image:'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=80',
    description:'Budget-friendly 7-seater MPV with modular seat configuration.',
    features:['AC','Touchscreen','Rear Camera','Modular Seats'],
  },
  {
    brand:'Honda', model:'BR-V', year:2022, type:'MUV',
    pricePerDay:2000, seats:7, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.2, numReviews:19,
    image:'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80',
    description:'7-seater MPV-SUV crossover with Honda reliability and comfortable cabin.',
    features:['AC','Honda Sensing','7 Seats','Touchscreen','Rear Camera'],
  },
  {
    brand:'Tata', model:'Safari', year:2024, type:'MUV',
    pricePerDay:3500, seats:7, transmission:'Automatic', fuelType:'Diesel',
    available:true, rating:4.6, numReviews:49,
    image:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format&fit=crop&q=80',
    description:'7-seater premium SUV-MPV with captain seats, ADAS and powerful diesel engine.',
    features:['Panoramic Sunroof','7 Captain Seats','JBL Sound','ADAS','Air Purifier'],
  },

  // ═══════════════════════════════════════════════════════════
  //  LUXURY — 10 cars (₹8000–₹25000/day)
  // ═══════════════════════════════════════════════════════════
  {
    brand:'BMW', model:'3 Series', year:2024, type:'Luxury',
    pricePerDay:8500, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.8, numReviews:44,
    image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80',
    description:'The ultimate driving machine. Sporty luxury sedan with curved iDrive display.',
    features:['AC','Live Cockpit Professional','Harman Kardon','Driving Assistant','Wireless Charging'],
  },
  {
    brand:'BMW', model:'5 Series', year:2024, type:'Luxury',
    pricePerDay:11000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.9, numReviews:38,
    image:'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80',
    description:'Executive luxury sedan with curved display, gesture control and M Sport package.',
    features:['Curved Display','Driving Assistant Pro','Harman Kardon','Massage Seats','HUD'],
  },
  {
    brand:'Mercedes-Benz', model:'C-Class', year:2024, type:'Luxury',
    pricePerDay:10000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.9, numReviews:41,
    image:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80',
    description:'Next-gen C-Class with MBUX Hyperscreen and advanced driver assistance.',
    features:['MBUX Hyperscreen','Burmester Sound','Augmented AR HUD','Massage Seats','ADAS'],
  },
  {
    brand:'Mercedes-Benz', model:'E-Class', year:2024, type:'Luxury',
    pricePerDay:14000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.9, numReviews:29,
    image:'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=80',
    description:'The pinnacle of executive luxury with superscreen dashboard and air suspension.',
    features:['MBUX Superscreen','Burmester 3D Sound','Rear Entertainment','Massage Seats','Air Suspension'],
  },
  {
    brand:'Audi', model:'A4', year:2024, type:'Luxury',
    pricePerDay:9000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.8, numReviews:35,
    image:'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=600&auto=format&fit=crop&q=80',
    description:'Quattro AWD luxury sedan with Virtual Cockpit and Matrix LED headlamps.',
    features:['Virtual Cockpit Plus','Quattro AWD','Bang & Olufsen','Matrix LED','MMI Touch'],
  },
  {
    brand:'Audi', model:'Q5', year:2024, type:'Luxury',
    pricePerDay:13000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.9, numReviews:22,
    image:'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=600&auto=format&fit=crop&q=80',
    description:'Premium luxury SUV with Quattro AWD, B&O sound and air suspension.',
    features:['Virtual Cockpit','B&O 3D Sound','Air Suspension','Night Vision','Massage Seats'],
  },
  {
    brand:'BMW', model:'X5', year:2024, type:'Luxury',
    pricePerDay:14000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.9, numReviews:31,
    image:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
    description:'Sports Activity Vehicle with xDrive AWD, curved display and panoramic roof.',
    features:['xDrive AWD','Curved Display','Bowers & Wilkins','Air Suspension','Driving Assistant Pro'],
  },
  {
    brand:'Mercedes-Benz', model:'GLC', year:2024, type:'Luxury',
    pricePerDay:13000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:4.9, numReviews:27,
    image:'https://images.unsplash.com/photo-1537984822441-cff330075342?w=600&auto=format&fit=crop&q=80',
    description:'Premium luxury SUV with MBUX Hyperscreen and 4MATIC AWD.',
    features:['MBUX Hyperscreen','4MATIC AWD','Burmester Sound','AR HUD','Massage Seats'],
  },
  {
    brand:'Porsche', model:'Cayenne', year:2024, type:'Luxury',
    pricePerDay:20000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:5.0, numReviews:14,
    image:'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=600&auto=format&fit=crop&q=80',
    description:'Sports car performance in an SUV. The benchmark of luxury performance SUVs.',
    features:['PASM Air Suspension','Burmester Sound','Panoramic Roof','Night Vision','Sport Chrono'],
  },
  {
    brand:'Range Rover', model:'Sport', year:2024, type:'Luxury',
    pricePerDay:25000, seats:5, transmission:'Automatic', fuelType:'Petrol',
    available:true, rating:5.0, numReviews:8,
    image:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=80',
    description:'The epitome of luxury SUVs. Effortless performance with unmatched refinement.',
    features:['Dynamic Air Suspension','Meridian Signature Sound','SV Bespoke','Rear Entertainment','Night Vision'],
  },
];

// ─────────────────────────────────────────────
//  RUN SEED
// ─────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    const deleted = await Car.deleteMany({});
    console.log(`🗑  Deleted ${deleted.deletedCount} existing vehicles`);

    const inserted = await Car.insertMany(vehicles);

    const hatchbacks = inserted.filter(v => v.type === 'Hatchback');
    const sedans     = inserted.filter(v => v.type === 'Sedan');
    const suvs       = inserted.filter(v => v.type === 'SUV');
    const muvs       = inserted.filter(v => v.type === 'MUV');
    const luxury     = inserted.filter(v => v.type === 'Luxury');

    console.log(`\n🎉 Seeded ${inserted.length} vehicles successfully!`);
    console.log(`   🚗 Hatchbacks: ${hatchbacks.length}`);
    console.log(`   🚘 Sedans:     ${sedans.length}`);
    console.log(`   🚙 SUVs:       ${suvs.length}`);
    console.log(`   🚌 MUVs:       ${muvs.length}`);
    console.log(`   👑 Luxury:     ${luxury.length}`);

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seed();