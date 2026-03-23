const { Pool } = require("pg");

function openDb() {
  return new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });
}

async function query(sql, values = []) {
  const pool = openDb();

  try {
    return await pool.query(sql, values);
  } finally {
    await pool.end();
  }
}

module.exports = {
  query,
};
