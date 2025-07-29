const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://localhost:27017/vape-shop';

// تعريف الـ Schema الخاص بالمستخدم مباشرة هنا
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  name: { type: String, required: true },
  secretAnswer: { type: String }
});
const User = mongoose.model('User', userSchema);

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  const email = 'mahdimahdix00@gmail.com';
  const password = 'mahdimahdi123';
  const name = 'mahdi';
  const secretAnswer = 'aizem';

  // تحقق إذا كان الأدمن موجود مسبقاً
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('يوجد أدمن بهذا الإيميل بالفعل');
    await mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const secretHash = await bcrypt.hash(secretAnswer, 10);
  const admin = new User({
    email,
    password: hash,
    name,
    role: 'admin',
    secretAnswer: secretHash
  });

  await admin.save();
  console.log('تم إنشاء الأدمن بنجاح');
  await mongoose.disconnect();
}

createAdmin(); 