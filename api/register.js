export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Dynamic imports for Vercel compatibility
    const { Pool } = await import('@neondatabase/serverless');
    const crypto = await import('crypto');
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        display_name VARCHAR(100),
        bio TEXT,
        theme VARCHAR(50) DEFAULT 'default',
        button_style VARCHAR(50) DEFAULT 'rounded',
        button_color VARCHAR(7) DEFAULT '#000000',
        enable_qr_code BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Get request data
    const { username, email, password, name } = req.body;
    
    // Validate input
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUserQuery = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUserQuery.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Hash password using crypto (built-in Node.js module)
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex') + ':' + salt;
    
    // Create user
    const insertResult = await pool.query(
      'INSERT INTO users (username, email, password, name, role) VALUES ($1, $2, $3, $4, $
