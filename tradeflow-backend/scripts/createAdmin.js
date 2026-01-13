import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is missing in your .env file");
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Get admin details from command line arguments or use defaults
    const args = process.argv.slice(2);
    const name = args[0] || 'Admin User';
    const email = args[1] || 'admin@tradeflow.com';
    const password = args[2] || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log("⚠️  Admin user already exists with this email!");
        console.log(`   Name: ${existingAdmin.name}`);
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Role: ${existingAdmin.role}`);
        await mongoose.disconnect();
        process.exit(0);
      } else {
        console.log(`⚠️  User with email ${email} exists but is not an admin.`);
        console.log(`   Current role: ${existingAdmin.role}`);
        const update = args[3] === '--update';
        if (!update) {
          console.log("   Use --update flag to convert this user to admin.");
          await mongoose.disconnect();
          process.exit(0);
        }
        // Update existing user to admin
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        existingAdmin.role = 'admin';
        existingAdmin.password = hashedPassword;
        existingAdmin.name = name;
        await existingAdmin.save();
        console.log("✅ User updated to admin successfully!");
        console.log(`   Name: ${existingAdmin.name}`);
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Password: ${password}`);
        await mongoose.disconnect();
        process.exit(0);
      }
    }

    // Create new admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      companyName: 'TradeFlow Admin'
    });

    await adminUser.save();

    console.log("\n✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   Name: ${name}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: admin`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📝 You can now login at: http://localhost:5173/admin/login");
    console.log("⚠️  Please change the default password after first login!\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
