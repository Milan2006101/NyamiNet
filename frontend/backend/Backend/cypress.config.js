const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
        }
        return launchOptions;
      });

      const mysql = require('mysql2/promise');

      // small helper to open a connection using env vars or sensible defaults
      function getDbConfig() {
        return {
          host: process.env.DB_HOST || 'localhost',
          // backend database container maps 3307->3306; use 3307 by default when not overridden
          port: Number(process.env.DB_PORT) || 3307,
          user: process.env.DB_USER || 'nyami',
          password: process.env.DB_PASSWORD || 'nyami',
          database: process.env.DATABASE || 'nyaminet',
        };
      }

      on('task', {
        async setUserRole({ id, role }) {
          try {
            const conn = await mysql.createConnection(getDbConfig());
            try {
              await conn.execute('UPDATE felhasznalok SET role_id = ? WHERE felhasznalo_id = ?', [role, id]);
            } finally {
              await conn.end();
            }
            return null;
          } finally {
            // always return null, errors already logged
          }
        },
        async deleteUser({ id }) {
          try {
            const conn = await mysql.createConnection(getDbConfig());
            try {
              await conn.execute('DELETE FROM felhasznalok WHERE felhasznalo_id = ?', [id]);
            } finally {
              await conn.end();
            }
            return null;
          } finally {
            // ignore errors
          }
        },
        async cleanupTestUsers() {
          try {
            const conn = await mysql.createConnection(getDbConfig());
            try {
              await conn.execute("DELETE FROM felhasznalok WHERE felhasznalo_email LIKE 'cypresstest%'");
            } finally {
              await conn.end();
            }
            return null;
          } finally {
            // ignore errors
          }
        },
      });

      return config;
    },
  },
});
