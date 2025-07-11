export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { Pool } = await import('@neondatabase/serverless');
    const bcrypt = await import('bcrypt');
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    const { username, email, password, name } = req.body;
    
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const existingUserQuery = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUserQuery.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const insertResult = await pool.query(
      'INSERT INTO users (username, email, password, name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, role, created_at',
      [username, email, hashedPassword, name, 'user']
    );
    
    const newUser = insertResult.rows[0];
    
    await pool.query(
      'INSERT INTO profiles (user_id, display_name, bio, theme, button_style, button_color, enable_qr_code) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [newUser.id, name, '', 'default', 'rounded', '#000000', true]
    );
    
    res.status(201).json(newUser);
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message
    });
  }
}
