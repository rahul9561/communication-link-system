const http = require('http');
const mysql = require('mysql2/promise');
const url = require('url');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing (npm install bcryptjs)

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'communication_links_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Initialize database connection pool and create tables if they don't exist
async function initDatabase() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log('Database connection pool created');

    // Create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255),
        role ENUM('Admin', 'User') DEFAULT 'User',
        two_fa_enabled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Insert default user if none exists (for demo purposes)
    const [existingUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count === 0) {
      const defaultPasswordHash = await bcrypt.hash('password123', 10);
      await pool.query(`
        INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
        VALUES ('John', 'Doe', 'john.doe@company.com', '+1 (555) 123-4567', ?, 'Admin')
      `, [defaultPasswordHash]);
      console.log('Default user created');
    }

    // Create user_preferences table for notifications
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        preference_key VARCHAR(50) NOT NULL,
        preference_value BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create user_sessions table for session management
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        device VARCHAR(255) NOT NULL,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Insert default preferences for user 1 (demo)
    const [prefs] = await pool.query('SELECT COUNT(*) as count FROM user_preferences WHERE user_id = 1');
    if (prefs[0].count === 0) {
      const defaultPrefs = [
        { key: 'linkAlerts', value: true },
        { key: 'maintenanceReminders', value: true },
        { key: 'weeklyReports', value: false },
        { key: 'realtimeUpdates', value: true },
        { key: 'systemAlerts', value: true }
      ];
      for (const pref of defaultPrefs) {
        await pool.query(
          'INSERT INTO user_preferences (user_id, preference_key, preference_value) VALUES (1, ?, ?)',
          [pref.key, pref.value]
        );
      }
      console.log('Default preferences created');
    }

    // Insert demo sessions for user 1
    const [sessions] = await pool.query('SELECT COUNT(*) as count FROM user_sessions WHERE user_id = 1');
    if (sessions[0].count === 0) {
      await pool.query(
        'INSERT INTO user_sessions (user_id, device, is_active) VALUES (1, "Chrome - Desktop", TRUE)'
      );
      await pool.query(
        'INSERT INTO user_sessions (user_id, device, is_active) VALUES (1, "Safari - Mobile", TRUE)'
      );
      console.log('Demo sessions created');
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// Parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Assume user ID is 1 for demo (no auth implemented)
const getUserId = () => 1;

// Route handlers for existing links and logs (unchanged)
const linkRoutes = {
  // Get all links
  'GET /api/links': async (req, res) => {
    try {
      const [links] = await pool.query(
        'SELECT * FROM communication_links ORDER BY created_at DESC'
      );
      sendJSON(res, 200, { success: true, data: links });
    } catch (error) {
      console.error('Error fetching links:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch links' });
    }
  },

  // Get single link
  'GET /api/links/:id': async (req, res, params) => {
    try {
      const [links] = await pool.query(
        'SELECT * FROM communication_links WHERE id = ?',
        [params.id]
      );
      if (links.length === 0) {
        sendJSON(res, 404, { success: false, error: 'Link not found' });
      } else {
        sendJSON(res, 200, { success: true, data: links[0] });
      }
    } catch (error) {
      console.error('Error fetching link:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch link' });
    }
  },

  // Create new link
  'POST /api/links': async (req, res) => {
    try {
      const body = await parseBody(req);
      const { clientName, clientEmail, linkType, linkUrl, status, description } = body;

      const [result] = await pool.query(
        `INSERT INTO communication_links 
        (client_name, client_email, link_type, link_url, status, description) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [clientName, clientEmail, linkType, linkUrl, status || 'active', description || '']
      );

      // Create log entry
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (?, ?, ?)`,
        [result.insertId, 'created', `Link created for ${clientName}`]
      );

      const [newLink] = await pool.query(
        'SELECT * FROM communication_links WHERE id = ?',
        [result.insertId]
      );

      sendJSON(res, 201, { success: true, data: newLink[0] });
    } catch (error) {
      console.error('Error creating link:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to create link' });
    }
  },

  // Update link
  'PUT /api/links/:id': async (req, res, params) => {
    try {
      const body = await parseBody(req);
      const { clientName, clientEmail, linkType, linkUrl, status, description } = body;

      await pool.query(
        `UPDATE communication_links 
        SET client_name = ?, client_email = ?, link_type = ?, 
            link_url = ?, status = ?, description = ?, last_updated = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        [clientName, clientEmail, linkType, linkUrl, status, description, params.id]
      );

      // Create log entry
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (?, ?, ?)`,
        [params.id, 'updated', `Link updated for ${clientName}`]
      );

      const [updatedLink] = await pool.query(
        'SELECT * FROM communication_links WHERE id = ?',
        [params.id]
      );

      sendJSON(res, 200, { success: true, data: updatedLink[0] });
    } catch (error) {
      console.error('Error updating link:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to update link' });
    }
  },

  // Delete link
  'DELETE /api/links/:id': async (req, res, params) => {
    try {
      const [link] = await pool.query(
        'SELECT client_name FROM communication_links WHERE id = ?',
        [params.id]
      );

      if (link.length === 0) {
        sendJSON(res, 404, { success: false, error: 'Link not found' });
        return;
      }

      await pool.query('DELETE FROM communication_links WHERE id = ?', [params.id]);

      // Create log entry
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (?, ?, ?)`,
        [params.id, 'deleted', `Link deleted for ${link[0].client_name}`]
      );

      sendJSON(res, 200, { success: true, message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to delete link' });
    }
  },

  // Get all logs
  'GET /api/logs': async (req, res) => {
    try {
      const [logs] = await pool.query(
        `SELECT *, details as message, 
         CASE 
           WHEN action = 'deleted' THEN 'warn' 
           ELSE 'info' 
         END as level 
         FROM activity_logs ORDER BY timestamp DESC LIMIT 100`
      );
      sendJSON(res, 200, { success: true, data: logs });
    } catch (error) {
      console.error('Error fetching logs:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch logs' });
    }
  },

  // Get logs for specific link
  'GET /api/logs/:linkId': async (req, res, params) => {
    try {
      const [logs] = await pool.query(
        `SELECT *, details as message, 
         CASE 
           WHEN action = 'deleted' THEN 'warn' 
           ELSE 'info' 
         END as level 
         FROM activity_logs WHERE link_id = ? ORDER BY timestamp DESC`,
        [params.linkId]
      );
      sendJSON(res, 200, { success: true, data: logs });
    } catch (error) {
      console.error('Error fetching logs:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch logs' });
    }
  }
};

// New routes for user settings
const userRoutes = {
  // Get user profile
  'GET /api/user/profile': async (req, res) => {
    try {
      const userId = getUserId();
      const [users] = await pool.query(
        'SELECT id, first_name as firstName, last_name as lastName, email, phone, role FROM users WHERE id = ?',
        [userId]
      );
      if (users.length === 0) {
        sendJSON(res, 404, { success: false, error: 'User not found' });
      } else {
        sendJSON(res, 200, { success: true, data: users[0] });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch profile' });
    }
  },

  // Update user profile
  'PUT /api/user/profile': async (req, res) => {
    try {
      const userId = getUserId();
      const body = await parseBody(req);
      const { firstName, lastName, email, phone } = body;

      await pool.query(
        `UPDATE users 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`,
        [firstName, lastName, email, phone, userId]
      );

      const [updatedUser] = await pool.query(
        'SELECT id, first_name as firstName, last_name as lastName, email, phone, role FROM users WHERE id = ?',
        [userId]
      );

      // Log activity (assuming activity_logs can be used for user actions too)
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, 'profile_updated', 'User profile updated')`
      );

      sendJSON(res, 200, { success: true, data: updatedUser[0] });
    } catch (error) {
      console.error('Error updating profile:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to update profile' });
    }
  },

  // Change password
  'PUT /api/user/password': async (req, res) => {
    try {
      const userId = getUserId();
      const body = await parseBody(req);
      const { currentPassword, newPassword, confirmNewPassword } = body;

      if (newPassword !== confirmNewPassword) {
        sendJSON(res, 400, { success: false, error: 'Passwords do not match' });
        return;
      }

      const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
      if (users.length === 0) {
        sendJSON(res, 404, { success: false, error: 'User not found' });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
      if (!isMatch) {
        sendJSON(res, 401, { success: false, error: 'Current password is incorrect' });
        return;
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      await pool.query(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPasswordHash, userId]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, 'password_changed', 'User password changed')`
      );

      sendJSON(res, 200, { success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to change password' });
    }
  },

  // Toggle notification
  'PUT /api/user/notifications/:key': async (req, res, params) => {
    try {
      const userId = getUserId();
      const { key } = params;
      const body = await parseBody(req);
      const { enabled } = body; // Expect { enabled: true/false }

      // Upsert preference
      await pool.query(
        `INSERT INTO user_preferences (user_id, preference_key, preference_value) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE preference_value = ?`,
        [userId, key, enabled, enabled]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, 'notification_toggled', 'Notification ${key} toggled to ${enabled}')`
      );

      sendJSON(res, 200, { success: true, message: `Notification ${key} updated` });
    } catch (error) {
      console.error('Error updating notification:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to update notification' });
    }
  },

  // Get all notifications
  'GET /api/user/notifications': async (req, res) => {
    try {
      const userId = getUserId();
      const [prefs] = await pool.query(
        'SELECT preference_key as key, preference_value as enabled FROM user_preferences WHERE user_id = ?',
        [userId]
      );
      const notifications = {};
      prefs.forEach(pref => {
        notifications[pref.key] = pref.enabled;
      });
      sendJSON(res, 200, { success: true, data: notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch notifications' });
    }
  },

  // Enable/Disable 2FA
  'PUT /api/user/security/2fa': async (req, res) => {
    try {
      const userId = getUserId();
      const body = await parseBody(req);
      const { enabled } = body;

      await pool.query(
        'UPDATE users SET two_fa_enabled = ? WHERE id = ?',
        [enabled, userId]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, '2fa_toggled', '2FA toggled to ${enabled}')`
      );

      sendJSON(res, 200, { success: true, message: '2FA updated' });
    } catch (error) {
      console.error('Error updating 2FA:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to update 2FA' });
    }
  },

  // Get sessions
  'GET /api/user/security/sessions': async (req, res) => {
    try {
      const userId = getUserId();
      const [sessions] = await pool.query(
        'SELECT device, last_active FROM user_sessions WHERE user_id = ? AND is_active = TRUE ORDER BY last_active DESC',
        [userId]
      );
      sendJSON(res, 200, { success: true, data: sessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch sessions' });
    }
  },

  // Sign out specific session
  'DELETE /api/user/security/sessions/:device': async (req, res, params) => {
    try {
      const userId = getUserId();
      const { device } = params;

      await pool.query(
        'UPDATE user_sessions SET is_active = FALSE WHERE user_id = ? AND device = ?',
        [userId, device]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, 'session_logged_out', 'Session ${device} logged out')`
      );

      sendJSON(res, 200, { success: true, message: 'Session signed out' });
    } catch (error) {
      console.error('Error signing out session:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to sign out session' });
    }
  },

  // Sign out all sessions
  'DELETE /api/user/security/sessions': async (req, res) => {
    try {
      const userId = getUserId();

      await pool.query(
        'UPDATE user_sessions SET is_active = FALSE WHERE user_id = ?',
        [userId]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, 'all_sessions_logged_out', 'All sessions logged out')`
      );

      sendJSON(res, 200, { success: true, message: 'All sessions signed out' });
    } catch (error) {
      console.error('Error signing out all sessions:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to sign out all sessions' });
    }
  },

  // Update role (admin only, demo)
  'PUT /api/user/profile/role': async (req, res) => {
    try {
      const userId = getUserId();
      const body = await parseBody(req);
      const { role } = body;

      await pool.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, userId]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, 'role_changed', 'Role changed to ${role}')`
      );

      sendJSON(res, 200, { success: true, message: 'Role updated' });
    } catch (error) {
      console.error('Error updating role:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to update role' });
    }
  },

  // Update system preferences (theme, language, data retention - for demo, store in user_preferences)
  'PUT /api/user/system/:key': async (req, res, params) => {
    try {
      const userId = getUserId();
      const { key } = params;
      const body = await parseBody(req);
      const { value } = body; // e.g., { value: 'dark' } for theme

      await pool.query(
        `INSERT INTO user_preferences (user_id, preference_key, preference_value) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE preference_value = ?`,
        [userId, key, value, value]
      );

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (link_id, action, details) 
        VALUES (NULL, 'system_updated', 'System ${key} updated to ${value}')`
      );

      sendJSON(res, 200, { success: true, message: `System ${key} updated` });
    } catch (error) {
      console.error('Error updating system preference:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to update system preference' });
    }
  },

  // Get system preferences
  'GET /api/user/system': async (req, res) => {
    try {
      const userId = getUserId();
      const [prefs] = await pool.query(
        `SELECT preference_key as key, preference_value as value 
         FROM user_preferences 
         WHERE user_id = ? AND preference_key IN ('theme', 'language', 'dataRetention')`,
        [userId]
      );
      const systemPrefs = {};
      prefs.forEach(pref => {
        systemPrefs[pref.key] = pref.value;
      });
      // Defaults
      if (!systemPrefs.theme) systemPrefs.theme = 'light';
      if (!systemPrefs.language) systemPrefs.language = 'English';
      if (!systemPrefs.dataRetention) systemPrefs.dataRetention = '30 days';
      sendJSON(res, 200, { success: true, data: systemPrefs });
    } catch (error) {
      console.error('Error fetching system preferences:', error);
      sendJSON(res, 500, { success: false, error: 'Failed to fetch system preferences' });
    }
  }
};

// Combined routes
const routes = { ...linkRoutes, ...userRoutes };

// Route matcher (updated to handle all routes)
function matchRoute(method, pathname) {
  for (const route in routes) {
    const [routeMethod, routePath] = route.split(' ');
    if (routeMethod !== method) continue;

    const routeParts = routePath.split('/').filter(p => p);
    const pathParts = pathname.split('/').filter(p => p);

    if (routeParts.length !== pathParts.length) continue;

    const params = {};
    let match = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return { handler: routes[route], params };
    }
  }
  return null;
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`${req.method} ${pathname}`);

  const match = matchRoute(req.method, pathname);

  if (match) {
    try {
      await match.handler(req, res, match.params);
    } catch (error) {
      console.error('Handler error:', error);
      sendJSON(res, 500, { success: false, error: 'Internal server error' });
    }
  } else {
    sendJSON(res, 404, { success: false, error: 'Route not found' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  Links & Logs:');
    console.log('    GET    /api/links       - Get all links');
    console.log('    GET    /api/links/:id   - Get single link');
    console.log('    POST   /api/links       - Create new link');
    console.log('    PUT    /api/links/:id   - Update link');
    console.log('    DELETE /api/links/:id   - Delete link');
    console.log('    GET    /api/logs        - Get all logs');
    console.log('    GET    /api/logs/:linkId - Get logs for link');
    console.log('  User Settings:');
    console.log('    GET    /api/user/profile         - Get profile');
    console.log('    PUT    /api/user/profile         - Update profile');
    console.log('    PUT    /api/user/profile/role    - Update role');
    console.log('    PUT    /api/user/password        - Change password');
    console.log('    GET    /api/user/notifications   - Get notifications');
    console.log('    PUT    /api/user/notifications/:key - Toggle notification');
    console.log('    GET    /api/user/security/sessions - Get sessions');
    console.log('    DELETE /api/user/security/sessions/:device - Sign out session');
    console.log('    DELETE /api/user/security/sessions - Sign out all');
    console.log('    PUT    /api/user/security/2fa    - Toggle 2FA');
    console.log('    GET    /api/user/system          - Get system prefs');
    console.log('    PUT    /api/user/system/:key     - Update system pref');
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    if (pool) {
      await pool.end();
      console.log('Database pool closed');
    }
    process.exit(0);
  });
});