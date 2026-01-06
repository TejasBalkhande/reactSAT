import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS for all origins
app.use('/api/*', cors({
  origin: ['https://your-react-app-domain.com', 'http://localhost:3000'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'Cloudflare Worker API is running',
    timestamp: new Date().toISOString(),
    database: 'D1 (Cloudflare)',
    environment: c.env.ENVIRONMENT || 'production'
  });
});

// Database initialization endpoint (FIXED - using prepare/run instead of exec)
app.get('/api/init-db', async (c) => {
  try {
    console.log('Initializing database...');
    
    // First, let's check what tables exist
    const tablesResult = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all();
    
    console.log('Existing tables:', tablesResult.results);
    
    // If blogs table already exists, don't recreate it
    const hasBlogsTable = tablesResult.results.some(table => table.name === 'blogs');
    
    if (hasBlogsTable) {
      return c.json({
        success: true,
        message: 'Blogs table already exists',
        existingTables: tablesResult.results.map(t => t.name)
      });
    }
    
    // Create blogs table
    await c.env.DB.prepare(`
      CREATE TABLE blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        category TEXT,
        meta_title TEXT,
        meta_description TEXT,
        keywords TEXT,
        author TEXT NOT NULL,
        cover_image TEXT,
        html_content TEXT NOT NULL,
        publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT CHECK(status IN ('draft', 'published')) DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        views INTEGER DEFAULT 0,
        reading_time INTEGER DEFAULT 5
      )
    `).run();
    
    // Create indexes for performance
    await c.env.DB.prepare(`CREATE INDEX idx_blogs_slug ON blogs(slug)`).run();
    await c.env.DB.prepare(`CREATE INDEX idx_blogs_category ON blogs(category)`).run();
    await c.env.DB.prepare(`CREATE INDEX idx_blogs_status_date ON blogs(status, publish_date)`).run();
    
    // Add a sample blog for testing
    await c.env.DB.prepare(`
      INSERT INTO blogs (title, slug, category, meta_title, meta_description, keywords, author, html_content, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      'Welcome to SAT Prep Blog',
      'welcome-to-sat-prep-blog',
      'SAT Tips',
      'SAT Preparation Guide | Get Started',
      'Start your SAT preparation journey with expert tips and strategies to boost your score.',
      'SAT, SAT prep, test preparation, college admissions',
      'SAT Prep Team',
      '<h1>Welcome to SAT Prep!</h1><p>This is a sample blog post to test the database connection.</p><p>Start your SAT preparation today!</p>',
      'published'
    ).run();

    return c.json({
      success: true,
      message: 'Cloudflare D1 database initialized successfully with sample data',
      tables: ['blogs'],
      sampleBlogCreated: true
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return c.json({ 
      success: false, 
      error: error.message,
      details: 'Failed to initialize Cloudflare D1 database. Note: The table might already exist.'
    }, 500);
  }
});

// Test endpoint to verify database connection
app.get('/api/test/db', async (c) => {
  try {
    const tables = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all();
    
    const blogCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM blogs").first();
    
    return c.json({
      success: true,
      database: 'Cloudflare D1',
      tables: tables.results,
      blogCount: blogCount?.count || 0,
      status: 'Connected',
      environment: c.env.ENVIRONMENT || 'production'
    });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Admin endpoint to see all blogs (including drafts)
app.get('/api/admin/blogs', async (c) => {
  try {
    const { status } = c.req.query();
    let query = "SELECT id, title, slug, category, status, author, created_at, views FROM blogs";
    let params = [];
    
    if (status) {
      query += " WHERE status = ?";
      params.push(status);
    }
    
    query += " ORDER BY created_at DESC";
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    
    return c.json({
      success: true,
      blogs: results,
      count: results.length
    });
  } catch (error) {
    console.error('Admin endpoint error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// GET ALL BLOGS (Handles Search, Category, Pagination, and Sort)
app.get('/api/blogs', async (c) => {
  try {
    const { page = 1, limit = 12, category, search, sort } = c.req.query();
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM blogs WHERE status = 'published'`;
    let params = [];

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (title LIKE ? OR meta_description LIKE ? OR keywords LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Sorting
    if (sort === 'popular' || sort === 'trending') {
      query += ` ORDER BY views DESC`;
    } else {
      query += ` ORDER BY publish_date DESC`;
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    
    // Fetch totals and categories for the sidebar
    const totalQuery = `SELECT COUNT(*) as count FROM blogs WHERE status = 'published'`;
    const totalResult = await c.env.DB.prepare(totalQuery).first();
    const total = totalResult?.count || 0;
    
    const categoriesQuery = `SELECT category, COUNT(*) as count FROM blogs WHERE status = 'published' GROUP BY category`;
    const categoriesResult = await c.env.DB.prepare(categoriesQuery).all();

    return c.json({
      success: true,
      blogs: results,
      categories: categoriesResult.results,
      pagination: {
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total
      },
      database: 'Cloudflare D1'
    });
  } catch (error) {
    console.error('Database error in GET /api/blogs:', error);
    return c.json({ 
      success: false, 
      error: error.message,
      details: 'Failed to fetch blogs from Cloudflare D1'
    }, 500);
  }
});

// GET SINGLE BLOG BY SLUG
app.get('/api/blogs/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');

    // Increment view count automatically on view
    await c.env.DB.prepare(`UPDATE blogs SET views = views + 1 WHERE slug = ?`)
      .bind(slug)
      .run();

    const blog = await c.env.DB.prepare(`SELECT * FROM blogs WHERE slug = ?`)
      .bind(slug)
      .first();
    
    if (!blog) {
      return c.json({ 
        success: false, 
        message: "Article not found in Cloudflare D1 database" 
      }, 404);
    }

    const related = await c.env.DB.prepare(
      `SELECT title, slug, cover_image, meta_description FROM blogs WHERE category = ? AND slug != ? AND status = 'published' LIMIT 3`
    ).bind(blog.category, slug).all();

    const trending = await c.env.DB.prepare(
      `SELECT title, slug, publish_date, views FROM blogs WHERE status = 'published' ORDER BY views DESC LIMIT 5`
    ).all();

    return c.json({
      success: true,
      blog,
      relatedPosts: related.results,
      trendingPosts: trending.results,
      database: 'Cloudflare D1'
    });
  } catch (error) {
    console.error('Database error in GET /api/blogs/:slug:', error);
    return c.json({ 
      success: false, 
      error: error.message,
      details: 'Failed to fetch blog from Cloudflare D1'
    }, 500);
  }
});

// CREATE BLOG POST (Used by CreateBlog.js)
app.post('/api/blogs', async (c) => {
  try {
    const body = await c.req.json();
    console.log('📝 Received blog data for Cloudflare D1:', body);
    
    // Validate required fields
    if (!body.title || !body.html_content) {
      return c.json({
        success: false,
        error: 'Title and content are required fields'
      }, 400);
    }

    // Generate slug if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim()
      .substring(0, 60);

    // Check if slug already exists
    const existingBlog = await c.env.DB.prepare(
      `SELECT id FROM blogs WHERE slug = ?`
    ).bind(slug).first();

    if (existingBlog) {
      return c.json({
        success: false,
        error: 'A blog with this slug already exists in Cloudflare D1',
        suggestion: 'Please use a different title or provide a unique slug'
      }, 409);
    }

    // Format publish_date for SQLite
    const publishDate = body.publish_date ? 
      `${body.publish_date} 00:00:00` : 
      new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // Default values
    const readingTime = body.reading_time || 5;
    const status = body.status || 'draft';
    const category = body.category || 'SAT Tips';
    const author = body.author || 'SAT Prep Team';
    const keywords = body.keywords || 'SAT, SAT Exam, SAT Preparation, College Admissions, Test Strategies';
    
    // Insert into Cloudflare D1 database
    const result = await c.env.DB.prepare(`
      INSERT INTO blogs (
        title, slug, category, meta_title, meta_description, 
        keywords, author, cover_image, html_content, status,
        publish_date, reading_time, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      body.title,
      slug,
      category,
      body.meta_title || body.title.substring(0, 60),
      body.meta_description || `${body.title.substring(0, 157)} - Expert SAT preparation tips`,
      keywords,
      author,
      body.cover_image || '',
      body.html_content,
      status,
      publishDate,
      readingTime
    ).run();

    console.log('✅ Blog saved to Cloudflare D1. Insert ID:', result.meta?.last_row_id);

    return c.json({ 
      success: true, 
      slug: slug,
      id: result.meta?.last_row_id,
      message: `Blog ${status === 'published' ? 'published' : 'saved as draft'} successfully in Cloudflare D1 database!`,
      database: 'Cloudflare D1',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database error in POST /api/blogs:', error.message);
    
    // Check for unique constraint violation
    if (error.message.includes('UNIQUE constraint failed')) {
      return c.json({ 
        success: false, 
        error: 'A blog with this slug already exists in Cloudflare D1',
        details: 'Please use a different title or provide a unique slug'
      }, 409);
    }

    return c.json({ 
      success: false, 
      error: error.message,
      details: 'Failed to save blog to Cloudflare D1 database. Check the database schema and constraints.'
    }, 500);
  }
});

// UPDATE BLOG POST
app.put('/api/blogs/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    await c.env.DB.prepare(`
      UPDATE blogs SET
        title = ?, slug = ?, category = ?, meta_title = ?, meta_description = ?,
        keywords = ?, author = ?, cover_image = ?, html_content = ?, status = ?,
        publish_date = ?, reading_time = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      body.title,
      body.slug,
      body.category,
      body.meta_title,
      body.meta_description,
      body.keywords,
      body.author,
      body.cover_image,
      body.html_content,
      body.status,
      body.publish_date ? `${body.publish_date} 00:00:00` : null,
      body.reading_time || 5,
      id
    ).run();

    return c.json({
      success: true,
      message: 'Blog updated successfully in Cloudflare D1'
    });
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// DELETE BLOG POST
app.delete('/api/blogs/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    await c.env.DB.prepare(`DELETE FROM blogs WHERE id = ?`)
      .bind(id)
      .run();

    return c.json({
      success: true,
      message: 'Blog deleted successfully from Cloudflare D1'
    });
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;