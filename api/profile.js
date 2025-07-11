export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    if (req.method === 'GET') {
      const { user_id, username } = req.query;
      
      let query, params;
      
      if (user_id) {
        query = 'SELECT * FROM profiles WHERE user_id = $1';
        params = [user_id];
      } else if (username) {
        query = `
          SELECT p.* FROM profiles p 
          JOIN users u ON p.user_id = u.id 
          WHERE u.username = $1
        `;
        params = [username];
      } else {
        return res.status(400).json({ message: 'user_id or username is required' });
      }
      
      const result = await pool.query(query, params);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    }
    
    if (req.method === 'PUT') {
      const { user_id, display_name, bio, theme, button_style, button_color, enable_qr_code } = req.body;
      
      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
      }
      
      const result = await pool.query(
        `UPDATE profiles SET 
         display_name = COALESCE($1, display_name),
         bio = COALESCE($2, bio),
         theme = COALESCE($3, theme),
         button_style = COALESCE($4, button_style),
         button_color = COALESCE($5, button_color),
         enable_qr_code = COALESCE($6, enable_qr_code)
         WHERE user_id = $7 RETURNING *`,
        [display_name, bio, theme, button_style, button_color, enable_qr_code, user_id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
}
