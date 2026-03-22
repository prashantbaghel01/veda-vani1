import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env first, then my.env if it exists
dotenv.config();
if (fs.existsSync(path.join(__dirname, 'my.env'))) {
  dotenv.config({ path: path.join(__dirname, 'my.env') });
}

import express from 'express';
import { createServer as createViteServer } from 'vite';
import mongoose from 'mongoose';

// Routes
import bookRoutes from './server/routes/bookRoutes.js';
import authRoutes from './server/routes/authRoutes.js';
import progressRoutes from './server/routes/progressRoutes.js';
import bookmarkRoutes from './server/routes/bookmarkRoutes.js';

let dbStatus = 'Disconnected';

async function connectDB() {
  let MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.warn('\n' + '!'.repeat(50));
    console.warn('CRITICAL WARNING: MONGODB_URI is not set!');
    console.warn('Please add MONGODB_URI to your environment variables in AI Studio Settings.');
    console.warn('The app will start, but database features will not work.');
    console.warn('!'.repeat(50) + '\n');
    dbStatus = 'Error: MONGODB_URI missing';
    return;
  }

  // Check if database name is missing in Atlas URI
  if (MONGODB_URI.includes('mongodb+srv://') && MONGODB_URI.includes('.mongodb.net/') && MONGODB_URI.split('.mongodb.net/')[1].startsWith('?')) {
    console.warn('⚠️  Warning: Your MongoDB URI seems to be missing a database name.');
    console.warn('It currently looks like: ...mongodb.net/?...');
    console.warn('It should look like: ...mongodb.net/myDatabaseName?...');
    console.warn('Defaulting to "test" database.');
    
    // Insert 'test' before the '?'
    const parts = MONGODB_URI.split('?');
    if (!parts[0].endsWith('/')) {
        MONGODB_URI = parts[0] + '/test' + (parts[1] ? '?' + parts[1] : '');
    } else {
        MONGODB_URI = parts[0] + 'test' + (parts[1] ? '?' + parts[1] : '');
    }
  }

  // Disable buffering to prevent "buffering timed out" errors.
  // Operations will fail immediately if not connected.
  mongoose.set('bufferCommands', false);

  try {
    console.log('Attempting to connect to MongoDB...');
    dbStatus = 'Connecting...';
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Reduced timeout for faster startup
      connectTimeoutMS: 5000,
      family: 4, // Force IPv4 to avoid potential DNS/IPv6 issues
    });
    console.log('✅ Connected to MongoDB successfully');
    dbStatus = 'Connected';
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    dbStatus = `Error: ${err instanceof Error ? err.message : String(err)}`;
    
    if (err instanceof Error && err.name === 'MongooseServerSelectionError') {
      console.error('\n' + '='.repeat(50));
      console.error('IP WHITELIST ERROR/CONNECTION TIMEOUT');
      console.error('Your MongoDB Atlas cluster might be rejecting the connection.');
      console.error('To fix this:');
      console.error('1. Go to your MongoDB Atlas Dashboard.');
      console.error('2. Navigate to "Network Access" under the "Security" section.');
      console.error('3. Click "Add IP Address".');
      console.error('4. For testing, you can click "Allow Access From Anywhere" (0.0.0.0/0).');
      console.error('5. Click "Confirm" and wait a minute for the changes to apply.');
      console.error('='.repeat(50) + '\n');
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/bookmarks', bookmarkRoutes);

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: dbStatus
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    
    // Connect to DB in background so it doesn't block startup
    connectDB();
  });
}

startServer();
