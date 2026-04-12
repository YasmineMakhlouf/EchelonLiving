import pool from "./src/config/db";

async function checkSchema() {
  const result = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'cart_items' ORDER BY ordinal_position"
  );

  console.log(result.rows);
  await pool.end();
}

checkSchema().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
