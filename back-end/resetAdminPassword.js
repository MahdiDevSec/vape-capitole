// ضع هذا الملف في back-end/src أو back-end مباشرة
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./src/models/user.model'); // عدّل المسار إذا لزم

const MONGO_URI = 'mongodb://localhost:27017/vape';
async function resetAdminPassword(email, newPassword) {
  await mongoose.connect(MONGO_URI);
  const hash = await bcrypt.hash(newPassword, 10);
  const result = await User.findOneAndUpdate(
    { email, role: 'admin' },
    { password: hash }
  );
  if (result) {
    console.log('تم تغيير كلمة السر بنجاح');
  } else {
    console.log('لم يتم العثور على الأدمن');
  }
  await mongoose.disconnect();
}

// استبدل EMAIL و NEWPASSWORD بالقيم المطلوبة
resetAdminPassword('admin@email.com', 'newpassword');
