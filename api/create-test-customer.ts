import bcrypt from "bcrypt";
import pool from "./src/config/db";

const SALT_ROUNDS = 10;

async function createTestCustomer() {
  try {
    // Customer credentials
    const customerEmail = "customer@example.com";
    const customerPassword = "customer123";
    const customerName = "Test Customer";

    // Hash password
    const hashedPassword = await bcrypt.hash(customerPassword, SALT_ROUNDS);

    // Insert customer user
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email, role",
      [customerName, customerEmail, hashedPassword, "customer"]
    );

    console.log("✅ Test customer created successfully!");
    console.log("---");
    console.log(`Email: ${customerEmail}`);
    console.log(`Password: ${customerPassword}`);
    console.log(`User ID: ${result.rows[0].id}`);
    console.log("---");
    
    await pool.end();
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      console.log("⚠️  Test customer already exists with this email.");
    } else {
      console.error("❌ Error creating test customer:", error);
    }
    await pool.end();
    process.exit(1);
  }
}

createTestCustomer();
