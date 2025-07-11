export default async function handler(req, res) {
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
    console.log('Registration request body:', req.body);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    const { Pool } = await import('@neondatabase/serverless');
    const crypto = await import('crypto');
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Test database connection
    const testQuery = await pool.query('SELECT NOW()');
    console.log('Database connection test:', testQuery.rows[0]);
    
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
    
    const { username, email, password, name } = req.body;
    
    if (!username || !email || !password || !name) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { username, email, password: !!password, name }
      });
    }
    
    // Check if user already exists
    const existingUserQuery = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUserQuery.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Hash password
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.scryptSync(password, salt, 64).toString('hex') + ':' + salt;
    
    // Create user
    const insertResult = await pool.query(
      'INSERT INTO users (username, email, password, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, role, created_at',
      [username, email, hashedPassword, name, 'user']
    );
    
    const newUser = insertResult.rows[0];
    console.log('New user created:', newUser);
    
    // Create profile
    await pool.query(
      'INSERT INTO profiles (user_id, display_name, bio, theme, button_style, button_color, enable_qr_code) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [newUser.id, name, '', 'default', 'rounded', '#000000', true]
    );
    
    console.log('Profile created for user:', newUser.id);
    
    res.status(201).json({
      success: true,
      user: newUser,
      message: 'Registration successful'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message,
      stack: error.stack
    });
  }
}
