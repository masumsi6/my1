export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { Pool } = await import('@neondatabase/serverless');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Create social_links table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        profile_id INTEGER NOT NULL,
        platform VARCHAR(50) NOT NULL,
        url VARCHAR(500) NOT NULL,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    if (req.method === 'GET') {
      const { profile_id } = req.query;
      
      if (!profile_id) {
        return res.status(400).json({ message: 'profile_id is required' });
      }
      
      const result = await pool.query(
        'SELECT * FROM social_links WHERE profile_id = $1 ORDER BY "order", created_at',
        [profile_id]
      );
      
      return res.status(200).json(result.rows);
    }
    
    if (req.method === 'POST') {
      const { profile_id, platform, url } = req.body;
      
      if (!profile_id || !platform || !url) {
        return res.status(400).json({ message: 'profile_id, platform, and url are required' });
      }
      
      // Get next order number
      const orderResult = await pool.query(
        'SELECT COALESCE(MAX("order"), 0) + 1 as next_order FROM social_links WHERE profile_id = $1',
        [profile_id]
      );
      const nextOrder = orderResult.rows[0].next_order;
      
      const result = await pool.query(
        'INSERT INTO social_links (profile_id, platform, url, "order") VALUES ($1, $2, $3, $4) RETURNING *',
        [profile_id, platform, url, nextOrder]
      );
      
      return res.status(201).json(result.rows[0]);
    }
    
    if (req.method === 'PUT') {
      const { id, platform, url } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: 'id is required' });
      }
      
      const result = await pool.query(
        'UPDATE social_links SET platform = COALESCE($1, platform), url = COALESCE($2, url) WHERE id = $3 RETURNING *',
        [platform, url, id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Social link not found' });
      }
      
      return res.status(200).json(result.rows[0]);
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ message: 'id is required' });
      }
      
      const result = await pool.query(
        'DELETE FROM social_links WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Social link not found' });
      }
      
      return res.status(200).json({ message: 'Social link deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
    
  } catch (error) {
    console.error('Social links API error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message
    });
  }
}
