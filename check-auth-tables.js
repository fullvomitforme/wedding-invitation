const { Pool } = require('pg');
const fs = require('fs');

// Load .env manually
const envContent = fs.readFileSync('.env', 'utf8');
const DATABASE_URL = envContent.match(/^DATABASE_URL=(.+)$/m)?.[1];

const pool = new Pool({ connectionString: DATABASE_URL });

pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user' ORDER BY ordinal_position")
  .then(res => {
    console.log('User table columns:', res.rows.length);
    console.log('Columns:', res.rows.map(r => `${r.column_name} (${r.data_type})`).join('\n  '));
    const hasEmailVerified = res.rows.some(r => r.column_name === 'emailVerified');
    if (!hasEmailVerified) {
      console.log('\nMissing emailVerified column!');
    }
  })
  .catch(err => console.error('Error:', err.message))
  .finally(() => pool.end());
