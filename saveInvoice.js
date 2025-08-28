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
    const { userId, emailId, invoiceNumber, invoiceDate, invoiceAmount, assetType } = JSON.parse(event.body);

    await pool.query(
      `INSERT INTO invoices (userId, emailId, invoiceNumber, invoiceDate, invoiceAmount, assetType, isDeleted)
       VALUES ($1,$2,$3,$4,$5,$6,false)
       ON CONFLICT (invoiceNumber) DO NOTHING`,
      [userId, emailId, invoiceNumber, invoiceDate, invoiceAmount, assetType]
    );

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("DB Error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Insert failed", details: err.message }) };
  }
}
