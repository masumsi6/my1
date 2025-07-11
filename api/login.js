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
    const { Pool } = await import('@neondatabase/serverless');
    const crypto = await import('crypto');
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const userQuery = await pool.query(
      'SELECT id, username, email, name, role, password, created_at FROM users WHERE username = $1',
      [username]
    );
    
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = userQuery.rows[0];
    
    const [hashedPassword, salt] = user.password.split(':');
    const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const isValidPassword = hashedPassword === verifyHash;
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const { password: _, ...userResponse } = user;
    
    res.status(200).json(userResponse);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed',
      error: error.message
    });
  }
}
