import bcrypt from "bcrypt";
import pool from "./src/config/db";

const SALT_ROUNDS = 10;

async function createAdminUser() {
  try {
    // Admin credentials
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";
    const adminName = "Admin User";

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    // Insert admin user
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email, role",
      [adminName, adminEmail, hashedPassword, "admin"]
    );

    console.log("✅ Admin user created successfully!");
    console.log("---");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`User ID: ${result.rows[0].id}`);
    console.log("---");
    console.log("You can now login to the admin dashboard.");
    
    await pool.end();
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      console.log("⚠️  Admin user already exists with this email.");
    } else {
      console.error("❌ Error creating admin user:", error);
    }
    await pool.end();
    process.exit(1);
  }
}

createAdminUser();
