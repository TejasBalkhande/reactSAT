-- Create blogs table if it doesn't exist
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
);

-- Create accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  account_type TEXT DEFAULT 'free',
  otp TEXT,
  otp_expiry DATETIME,
  is_verified BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  profile_picture TEXT,
  full_name TEXT,
  subscription_expiry DATETIME,
  status TEXT DEFAULT 'active'
);

-- Create indexes for blogs
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_status_date ON blogs(status, publish_date);

-- Create indexes for accounts
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_username ON accounts(username);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);

-- Insert sample data only if tables are empty
INSERT OR IGNORE INTO blogs (title, slug, category, meta_title, meta_description, keywords, author, html_content, status) 
VALUES (
  'Welcome to SAT Prep Blog',
  'welcome-to-sat-prep-blog',
  'SAT Tips',
  'SAT Preparation Guide | Get Started',
  'Start your SAT preparation journey with expert tips and strategies to boost your score.',
  'SAT, SAT prep, test preparation, college admissions',
  'SAT Prep Team',
  '<h1>Welcome to SAT Prep!</h1><p>This is a sample blog post to test the database connection.</p><p>Start your SAT preparation today!</p>',
  'published'
);

-- Insert test account only if it doesn't exist
INSERT OR IGNORE INTO accounts (username, email, password, account_type, is_verified) 
VALUES (
  'testuser',
  'test@example.com',
  'hashed_password_here',
  'premium',
  1
);