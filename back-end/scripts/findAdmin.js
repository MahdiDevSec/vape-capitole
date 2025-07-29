const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  name: String,
});
const User = mongoose.model('User', userSchema);

async function findAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ role: 'admin' });
  if (admin) {
    console.log('Admin user found:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
  } else {
    console.log('No admin user found.');
  }
  await mongoose.disconnect();
}

findAdmin(); 