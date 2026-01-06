-- Drop table if it exists
DROP TABLE IF EXISTS blogs;

-- Create blogs table
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
);

-- Create indexes
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_category ON blogs(category);
CREATE INDEX idx_blogs_status_date ON blogs(status, publish_date);