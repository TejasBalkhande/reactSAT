import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Enable CORS for all origins
app.use('/api/*', cors({
  origin: ['http://localhost:3000', 'https://sat-blog-worker.tejasbalkhande221.workers.dev'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 600,
  credentials: true,
}));

// FIXED: Improved password hashing helper
const hashPassword = async (password) => {
  try {
    // Using SHA-256 for hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Hashing error:', error);
    throw error;
  }
};

// JWT helper functions (simplified for demo)
const generateToken = (userId, username) => {
  // In production, use a proper JWT library
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId,
    username,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }));
  // Create a simple signature (in production, use proper HMAC)
  const signature = btoa(`${header}.${payload}.${crypto.randomUUID()}`);
  return `${header}.${payload}.${signature}`;
};

const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null;
    
    return payload;
  } catch (error) {
    return null;
  }
};

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({
    success: false,
    error: 'Internal server error',
    message: err.message
  }, 500);
});

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

// Initialize Database - Creates accounts and blogs tables
app.get('/api/init-db', async (c) => {
  try {
    console.log('🚀 Initializing Cloudflare D1 database...');
    
    // First, check existing tables
    const existingTables = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all();
    
    console.log('Existing tables:', existingTables.results);
    
    // Create accounts table (keeping OTP columns for future use)
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        account_type TEXT DEFAULT 'free',
        otp TEXT,
        otp_expiry DATETIME,
        is_verified BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        profile_picture TEXT,
        full_name TEXT,
        subscription_expiry DATETIME,
        status TEXT DEFAULT 'active'
      )
    `).run();
    
    console.log('✅ Accounts table created or already exists');
    
    // Create blogs table
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS blogs (
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
    
    console.log('✅ Blogs table created or already exists');
    
    // Create indexes
    await c.env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email)`).run();
    await c.env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_accounts_username ON accounts(username)`).run();
    await c.env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)`).run();
    await c.env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category)`).run();
    await c.env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_blogs_status_date ON blogs(status, publish_date)`).run();
    
    console.log('✅ Indexes created');
    
    // Check counts
    const blogCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM blogs").first();
    const accountCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM accounts").first();
    
    // Add sample blog if none exist
    if (blogCount.count === 0) {
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
      console.log('✅ Sample blog added');
    }
    
    // Add test account if none exist (with hashed password)
    if (accountCount.count === 0) {
      // FIXED: Properly await the hashPassword function
      const hashedPassword = await hashPassword('Test@123');
      console.log('Generated hash for Test@123:', hashedPassword);
      
      await c.env.DB.prepare(`
        INSERT INTO accounts (username, email, password, account_type, is_verified) 
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        'testuser',
        'test@example.com',
        hashedPassword,
        'premium',
        1
      ).run();
      console.log('✅ Test account added');
    }
    
    return c.json({
      success: true,
      message: 'Cloudflare D1 database initialized successfully',
      tables: ['accounts', 'blogs'],
      existingTables: existingTables.results.map(t => t.name),
      counts: {
        accounts: accountCount.count,
        blogs: blogCount.count
      }
    });
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    return c.json({ 
      success: false, 
      error: error.message,
      details: 'Failed to initialize Cloudflare D1 database'
    }, 500);
  }
});

// CHECK DUPLICATE USERNAME/EMAIL ENDPOINT
app.get('/api/check-duplicate', async (c) => {
  try {
    const { username, email } = c.req.query();
    
    if (!username && !email) {
      return c.json({
        success: false,
        error: 'Please provide username or email to check'
      }, 400);
    }
    
    let result = {};
    
    if (username) {
      const existingAccount = await c.env.DB.prepare(
        `SELECT id FROM accounts WHERE username = ?`
      ).bind(username).first();
      
      result.username = {
        exists: !!existingAccount,
        available: !existingAccount
      };
    }
    
    if (email) {
      const existingAccount = await c.env.DB.prepare(
        `SELECT id FROM accounts WHERE email = ?`
      ).bind(email).first();
      
      result.email = {
        exists: !!existingAccount,
        available: !existingAccount
      };
    }
    
    return c.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Check duplicate error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to check for duplicates'
    }, 500);
  }
});

// SIGNUP ENDPOINT - With password hashing
app.post('/api/signup', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    console.error('Failed to parse request body:', e);
    return c.json({
      success: false,
      error: 'Invalid JSON in request body'
    }, 400);
  }
  
  try {
    console.log('📝 Received signup data for Cloudflare D1:', { 
      username: body.username, 
      email: body.email,
      password_length: body.password ? body.password.length : 0
    });
    
    // Validate required fields
    if (!body.username || !body.email || !body.password) {
      return c.json({
        success: false,
        error: 'Username, email, and password are required fields'
      }, 400);
    }
    
    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(body.username)) {
      return c.json({
        success: false,
        error: 'Username can only contain letters, numbers, and underscores',
        field: 'username'
      }, 400);
    }
    
    // Validate username length
    if (body.username.length < 3) {
      return c.json({
        success: false,
        error: 'Username must be at least 3 characters',
        field: 'username'
      }, 400);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return c.json({
        success: false,
        error: 'Please enter a valid email address',
        field: 'email'
      }, 400);
    }
    
    // Validate password length
    if (body.password.length < 6) {
      return c.json({
        success: false,
        error: 'Password must be at least 6 characters long',
        field: 'password'
      }, 400);
    }
    
    // Check if username already exists
    const existingUsername = await c.env.DB.prepare(
      `SELECT id FROM accounts WHERE username = ?`
    ).bind(body.username).first();
    
    if (existingUsername) {
      return c.json({
        success: false,
        error: 'Username already exists',
        field: 'username'
      }, 409);
    }
    
    // Check if email already exists
    const existingEmail = await c.env.DB.prepare(
      `SELECT id FROM accounts WHERE email = ?`
    ).bind(body.email).first();
    
    if (existingEmail) {
      return c.json({
        success: false,
        error: 'Email already registered',
        field: 'email'
      }, 409);
    }
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(body.password);
    
    // Insert into Cloudflare D1 database as VERIFIED (no OTP needed)
    const result = await c.env.DB.prepare(`
      INSERT INTO accounts (
        username, email, password, account_type, 
        is_verified, created_at, updated_at, status
      ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'), ?)
    `).bind(
      body.username,
      body.email,
      hashedPassword,
      body.account_type || 'free',
      1, // Mark as verified immediately
      'active'
    ).run();
    
    console.log('✅ Account created in Cloudflare D1. Insert ID:', result.meta?.last_row_id);
    
    // Fetch the newly created account
    const newAccount = await c.env.DB.prepare(
      `SELECT id, username, email, account_type, created_at FROM accounts WHERE id = ?`
    ).bind(result.meta?.last_row_id).first();
    
    console.log('✅ Account created:', newAccount);
    
    // Generate JWT token for immediate login
    const token = generateToken(newAccount.id, newAccount.username);
    
    return c.json({ 
      success: true, 
      message: 'Account created successfully!',
      user: {
        id: newAccount.id,
        username: newAccount.username,
        email: newAccount.email,
        account_type: newAccount.account_type
      },
      token: token,
      expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Signup error:', error.message);
    console.error('Full error:', error);
    
    // Handle unique constraint violations
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      if (error.message.includes('username')) {
        return c.json({ 
          success: false, 
          error: 'Username already exists',
          field: 'username'
        }, 409);
      }
      if (error.message.includes('email')) {
        return c.json({ 
          success: false, 
          error: 'Email already registered',
          field: 'email'
        }, 409);
      }
    }
    
    return c.json({ 
      success: false, 
      error: 'Failed to create account',
      details: error.message
    }, 500);
  }
});

// LOGIN ENDPOINT - With password hashing and JWT
app.post('/api/login', async (c) => {
  try {
    const body = await c.req.json();
    
    console.log('📥 Login attempt for email:', body.email);
    
    if (!body.email || !body.password) {
      return c.json({
        success: false,
        error: 'Email and password are required'
      }, 400);
    }
    
    // Get account from database
    const account = await c.env.DB.prepare(
      `SELECT id, username, email, password, account_type, is_verified, status FROM accounts WHERE email = ?`
    ).bind(body.email).first();
    
    if (!account) {
      console.log('❌ Account not found for email:', body.email);
      return c.json({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    
    console.log('✅ Account found:', account.id, account.username);
    console.log('🔑 Stored hash:', account.password.substring(0, 20) + '...');
    
    // Hash the provided password for comparison
    const hashedPassword = await hashPassword(body.password);
    console.log('🔑 Provided password hash:', hashedPassword.substring(0, 20) + '...');
    
    // FIXED: Debug logging for hash comparison
    console.log('🔍 Hash comparison:', {
      storedLength: account.password.length,
      providedLength: hashedPassword.length,
      match: account.password === hashedPassword
    });
    
    // Check hashed password
    if (account.password !== hashedPassword) {
      console.log('❌ Password mismatch');
      return c.json({
        success: false,
        error: 'Invalid email or password'
      }, 401);
    }
    
    // Check if account is active
    if (account.status !== 'active') {
      return c.json({
        success: false,
        error: 'Account is not active'
      }, 401);
    }
    
    // Update last login
    await c.env.DB.prepare(
      `UPDATE accounts SET last_login = datetime('now') WHERE id = ?`
    ).bind(account.id).run();
    
    // Generate JWT token
    const token = generateToken(account.id, account.username);
    
    console.log('✅ Login successful for user:', account.username);
    
    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: account.id,
        username: account.username,
        email: account.email,
        account_type: account.account_type,
        is_verified: account.is_verified
      },
      token: token,
      expires_in: 7 * 24 * 60 * 60 // 7 days in seconds
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to login'
    }, 500);
  }
});

// PROFILE ENDPOINT (Protected)
app.get('/api/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'No token provided' }, 401);
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return c.json({ success: false, error: 'Invalid or expired token' }, 401);
    }
    
    const account = await c.env.DB.prepare(
      `SELECT id, username, email, account_type, is_verified, 
       created_at, last_login, profile_picture, full_name, 
       subscription_expiry, status 
       FROM accounts WHERE id = ?`
    ).bind(decoded.userId).first();
    
    if (!account) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    return c.json({
      success: true,
      user: account
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    return c.json({ success: false, error: 'Failed to fetch profile' }, 500);
  }
});

// LOGOUT ENDPOINT (client-side only)
app.post('/api/logout', async (c) => {
  return c.json({
    success: true,
    message: 'Logout successful'
  });
});

// GET ALL ACCOUNTS (Admin)
app.get('/api/admin/accounts', async (c) => {
  try {
    const { page = 1, limit = 50 } = c.req.query();
    const offset = (page - 1) * limit;
    
    const { results } = await c.env.DB.prepare(
      `SELECT id, username, email, account_type, is_verified, created_at, last_login, status 
       FROM accounts ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).bind(parseInt(limit), offset).all();
    
    const totalResult = await c.env.DB.prepare(
      `SELECT COUNT(*) as count FROM accounts`
    ).first();
    
    return c.json({
      success: true,
      accounts: results,
      total: totalResult?.count || 0,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get accounts error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// GET ACCOUNT BY ID
app.get('/api/accounts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const account = await c.env.DB.prepare(
      `SELECT id, username, email, account_type, is_verified, created_at, last_login, status 
       FROM accounts WHERE id = ?`
    ).bind(id).first();
    
    if (!account) {
      return c.json({ success: false, error: 'Account not found' }, 404);
    }
    
    return c.json({
      success: true,
      account: account
    });
  } catch (error) {
    console.error('Get account error:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// CHECK DATABASE STATUS
app.get('/api/db-status', async (c) => {
  try {
    // Check if accounts table exists
    const accountsTable = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='accounts'"
    ).first();
    
    // Check if blogs table exists
    const blogsTable = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='blogs'"
    ).first();
    
    // Count records
    const accountsCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM accounts").first();
    const blogsCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM blogs").first();
    
    // List all tables
    const allTables = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all();
    
    return c.json({
      success: true,
      database: 'Cloudflare D1 (Remote)',
      tables: {
        accounts: {
          exists: !!accountsTable,
          count: accountsCount?.count || 0
        },
        blogs: {
          exists: !!blogsTable,
          count: blogsCount?.count || 0
        }
      },
      all_tables: allTables.results,
      status: 'Connected'
    });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Test endpoint to verify database connection
app.get('/api/test/db', async (c) => {
  try {
    const tables = await c.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all();
    
    const blogCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM blogs").first();
    const accountCount = await c.env.DB.prepare("SELECT COUNT(*) as count FROM accounts").first();
    
    return c.json({
      success: true,
      database: 'Cloudflare D1',
      tables: tables.results,
      blogCount: blogCount?.count || 0,
      accountCount: accountCount?.count || 0,
      status: 'Connected',
      environment: c.env.ENVIRONMENT || 'production'
    });
  } catch (error) {
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

// CREATE BLOG POST
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

// Fallback route - always return JSON
app.all('*', (c) => {
  return c.json({
    success: false,
    error: 'Route not found',
    path: c.req.path
  }, 404);
});

// Add this after your existing endpoints in index.js

// ==================== ROADMAP ENDPOINTS ====================

// GET ROADMAP BY EMAIL
app.get('/api/roadmap', async (c) => {
  try {
    const email = c.req.query('email');
    
    if (!email) {
      return c.json({ 
        success: false, 
        error: 'Email is required' 
      }, 400);
    }
    
    const roadmap = await c.env.DB.prepare(
      `SELECT roadmap_string, current_level FROM roadmaps WHERE email = ?`
    ).bind(email).first();
    
    if (!roadmap) {
      return c.json({ 
        success: true, 
        exists: false,
        message: 'No roadmap found for this user' 
      });
    }
    
    return c.json({
      success: true,
      exists: true,
      roadmapString: roadmap.roadmap_string,
      level: roadmap.current_level || 0
    });
    
  } catch (error) {
    console.error('Get roadmap error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to get roadmap' 
    }, 500);
  }
});

// SAVE/UPDATE ROADMAP
app.post('/api/roadmap', async (c) => {
  try {
    const body = await c.req.json();
    const { email, roadmapString, level } = body;
    
    if (!email || !roadmapString) {
      return c.json({ 
        success: false, 
        error: 'Email and roadmapString are required' 
      }, 400);
    }
    
    // Check if roadmap exists
    const existing = await c.env.DB.prepare(
      `SELECT id FROM roadmaps WHERE email = ?`
    ).bind(email).first();
    
    let result;
    
    if (existing) {
      // Update existing roadmap
      result = await c.env.DB.prepare(`
        UPDATE roadmaps 
        SET roadmap_string = ?, current_level = ?, updated_at = datetime('now')
        WHERE email = ?
      `).bind(roadmapString, level || 0, email).run();
    } else {
      // Insert new roadmap
      result = await c.env.DB.prepare(`
        INSERT INTO roadmaps (email, roadmap_string, current_level, created_at, updated_at)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `).bind(email, roadmapString, level || 0).run();
    }
    
    return c.json({
      success: true,
      message: existing ? 'Roadmap updated' : 'Roadmap saved',
      roadmapString,
      level: level || 0
    });
    
  } catch (error) {
    console.error('Save roadmap error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to save roadmap' 
    }, 500);
  }
});

// DELETE ROADMAP
app.delete('/api/roadmap', async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ 
        success: false, 
        error: 'Email is required' 
      }, 400);
    }
    
    await c.env.DB.prepare(
      `DELETE FROM roadmaps WHERE email = ?`
    ).bind(email).run();
    
    return c.json({
      success: true,
      message: 'Roadmap deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete roadmap error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to delete roadmap' 
    }, 500);
  }
});

// Export the app
export default app;