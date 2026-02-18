const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Required because Supabase uses SSL for security
    rejectUnauthorized: false,
  },
});

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error("❌ Supabase Connection Error:", err.message);
  else console.log("✅ Database Connected to Supabase at:", res.rows[0].now);
});

module.exports = pool;
