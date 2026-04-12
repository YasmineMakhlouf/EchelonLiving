import pool from "./src/config/db";

const migrateDatabase = async () => {
  try {
    console.log("Running database migration...\n");

    // Check if created_at column exists in product_images
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'product_images' AND column_name = 'created_at'
    `);

    if (checkColumn.rows.length === 0) {
      console.log("Adding missing created_at column to product_images table...");
      await pool.query(`
        ALTER TABLE product_images 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log("✅ created_at column added to product_images");
    } else {
      console.log("✅ created_at column already exists in product_images");
    }

    const cartPriceColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'cart_items' AND column_name = 'price_at_time'
    `);

    if (cartPriceColumn.rows.length === 0) {
      console.log("Adding missing price_at_time column to cart_items table...");
      await pool.query(`
        ALTER TABLE cart_items
        ADD COLUMN price_at_time DECIMAL(10, 2)
      `);
      console.log("✅ price_at_time column added to cart_items");
    } else {
      console.log("✅ price_at_time column already exists in cart_items");
    }

    const designRequestsTable = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'design_requests'
    `);

    if (designRequestsTable.rows.length === 0) {
      console.log("Creating design_requests table...");
      await pool.query(`
        CREATE TABLE design_requests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          notes TEXT,
          design_data_url TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'pending',
          admin_notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          reviewed_at TIMESTAMP
        )
      `);
      console.log("✅ design_requests table created");
    } else {
      console.log("✅ design_requests table already exists");
    }

    console.log("\n✅ Migration completed successfully!");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    await pool.end();
    process.exit(1);
  }
};

migrateDatabase();
