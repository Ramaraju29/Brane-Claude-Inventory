import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { invoiceNumber, newDate } = JSON.parse(event.body);
    await pool.query("UPDATE invoices SET invoiceDate = $1 WHERE invoiceNumber = $2", [newDate, invoiceNumber]);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("DB Renew Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Renew failed", details: err.message }) };
  }
}
