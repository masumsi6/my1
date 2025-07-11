export default async function handler(req, res) {
  try {
    const { Pool } = await import('@neondatabase/serverless');
    
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Test database connection
    const result = await pool.query('SELECT NOW() as current_time');
    
    // Check if tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    res.status(200).json({
      message: 'Database connection successful',
      current_time: result.rows[0].current_time,
      tables: tables.rows.map(row => row.table_name),
      database_url_exists: !!process.env.DATABASE_URL,
      database_url_preview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'Not found'
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
      stack: error.stack
    });
  }
}
