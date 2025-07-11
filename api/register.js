// Direct registration endpoint for Vercel
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
    // Import necessary modules
    const { storage } = await import('../server/storage.js');
    const { insertUserSchema } = await import('../shared/schema.js');
    const bcrypt = await import('bcrypt');
    
    // Get request data
    const { username, email, password, name } = req.body;
    
    // Validate input
    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const existingEmail = await storage.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userData = {
      username,
      email,
      password: hashedPassword,
      name,
      role: 'user'
    };
    
    const newUser = await storage.createUser(userData);
    
    // Remove password from response
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json(userResponse);
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message,
      stack: error.stack 
    });
  }
}
