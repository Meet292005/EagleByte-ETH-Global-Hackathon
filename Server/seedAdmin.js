const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  console.error('ERROR: DB_URL is not set in environment variables (.env)');
  process.exit(1);
}

mongoose.connect(dbUrl)
  .then(async () => {
    console.log('MongoDB connected for seeding');
    
    // Check if admin user exists
    const email = 'kartikparmar9773@gmail.com';
    const password = 'admin'; // Default password
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({
      email,
      password: hashedPassword,
      isAdmin: true
    });
    
    await newUser.save();
    console.log(`Admin user created.\nEmail: ${email}\nPassword: ${password}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
