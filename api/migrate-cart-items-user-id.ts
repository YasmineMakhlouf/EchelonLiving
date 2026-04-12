import pool from "./src/config/db";

async function migrateCartItemsUserId() {
  try {
    console.log("Running cart_items migration...");

    const columnsResult = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'cart_items'"
    );

    const columns = new Set<string>(
      columnsResult.rows.map((row) => String((row as { column_name: string }).column_name))
    );

    if (!columns.has("user_id")) {
      await pool.query("ALTER TABLE cart_items ADD COLUMN user_id INTEGER");
      console.log("Added user_id column");
    }

    if (columns.has("cart_id")) {
      await pool.query("UPDATE cart_items SET user_id = cart_id WHERE user_id IS NULL");
      console.log("Backfilled user_id from cart_id");
    }

    await pool.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'cart_items_user_id_fkey'
        ) THEN
          ALTER TABLE cart_items
          ADD CONSTRAINT cart_items_user_id_fkey
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        END IF;
      END
      $$;`
    );

    await pool.query(
      `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'cart_items_user_product_unique'
        ) THEN
          ALTER TABLE cart_items
          ADD CONSTRAINT cart_items_user_product_unique UNIQUE (user_id, product_id);
        END IF;
      END
      $$;`
    );

    console.log("cart_items migration completed successfully.");
    await pool.end();
  } catch (error) {
    console.error("Migration failed:", error);
    await pool.end();
    process.exit(1);
  }
}

migrateCartItemsUserId();
