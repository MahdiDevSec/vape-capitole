const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Edit this URI according to your setup
const MONGO_URI = 'mongodb://localhost:27017/vape-shop';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function addAdmin() {
  const email = await ask('Admin email: ');
  const name = await ask('Admin name: ');
  const password = await ask('Password: ');
  const secretAnswer = await ask('Secret answer: ');
  const hash = await bcrypt.hash(password, 10);
  await mongoose.connect(MONGO_URI);
  const users = mongoose.connection.collection('users');
  const exists = await users.findOne({ email });
  if (exists) {
    console.log('A user with this email already exists!');
  } else {
    await users.insertOne({ email, name, password: hash, role: 'admin', secretAnswer });
    console.log('Admin added successfully!');
  }
  await mongoose.disconnect();
  rl.close();
}

async function resetAdmin() {
  const email = await ask('Enter the admin email to update: ');
  await mongoose.connect(MONGO_URI);
  const users = mongoose.connection.collection('users');
  const admin = await users.findOne({ email, role: 'admin' });
  if (!admin) {
    console.log('No admin found with this email!');
    await mongoose.disconnect();
    rl.close();
    return;
  }
  const name = await ask(`New name (leave empty to keep current: ${admin.name}): `);
  const password = await ask('New password (leave empty to keep current): ');
  const secretAnswer = await ask('New secret answer (leave empty to keep current): ');
  let update = {};
  if (name) update.name = name;
  if (password) update.password = await bcrypt.hash(password, 10);
  if (secretAnswer) update.secretAnswer = secretAnswer;
  if (Object.keys(update).length === 0) {
    console.log('No changes entered.');
  } else {
    await users.updateOne({ email, role: 'admin' }, { $set: update });
    console.log('Admin data updated successfully!');
  }
  await mongoose.disconnect();
  rl.close();
}

async function main() {
  console.log('Choose an action:');
  console.log('1) Add new admin');
  console.log('2) Reset existing admin info');
  const choice = await ask('Enter action number: ');
  if (choice === '1') {
    await addAdmin();
  } else if (choice === '2') {
    await resetAdmin();
  } else {
    console.log('Invalid choice!');
    rl.close();
  }
}

main(); 