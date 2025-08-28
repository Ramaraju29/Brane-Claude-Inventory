import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function handler() {
  try {
    const result = await pool.query("SELECT * FROM invoices ORDER BY invoiceDate DESC");
    return { statusCode: 200, body: JSON.stringify(result.rows) };
  } catch (err) {
    console.error("DB Fetch Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Fetch failed", details: err.message }) };
  }
}
