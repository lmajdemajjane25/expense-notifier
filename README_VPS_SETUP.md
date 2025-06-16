
# VPS Database Setup Instructions

## 1. Set up PostgreSQL Database

Run the SQL script to create your database schema:

```bash
psql -U NotifUsr675 -d db_notifusr675 -f vps_database_setup.sql
```

## 2. Set up PostgREST (REST API for PostgreSQL)

Since your app expects a REST API similar to Supabase, you need to install PostgREST:

### Install PostgREST
```bash
# Download PostgREST
wget https://github.com/PostgREST/postgrest/releases/download/v12.0.2/postgrest-v12.0.2-linux-static-x64.tar.xz
tar -xf postgrest-v12.0.2-linux-static-x64.tar.xz
sudo mv postgrest /usr/local/bin/
```

### Create PostgREST Configuration
Create a file `/etc/postgrest.conf`:

```ini
db-uri = "postgres://NotifUsr675:your_password@localhost:5432/db_notifusr675"
db-schemas = "public"
db-anon-role = "NotifUsr675"
server-port = 3000
```

### Create systemd service
Create `/etc/systemd/system/postgrest.service`:

```ini
[Unit]
Description=PostgREST
After=postgresql.service

[Service]
ExecStart=/usr/local/bin/postgrest /etc/postgrest.conf
User=www-data
Group=www-data
Restart=always

[Install]
WantedBy=multi-user.target
```

### Start PostgREST
```bash
sudo systemctl enable postgrest
sudo systemctl start postgrest
sudo systemctl status postgrest
```

## 3. Configure Your App

Create a `.env` file in your project:

```env
VITE_SUPABASE_URL=http://your-vps-ip:3000
VITE_SUPABASE_ANON_KEY=your-jwt-secret-here
```

## 4. Set up Nginx Proxy (Optional)

Add to your Nginx configuration:

```nginx
location /api/ {
    proxy_pass http://localhost:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

Then use in your `.env`:
```env
VITE_SUPABASE_URL=https://your-domain.com/api
VITE_SUPABASE_ANON_KEY=your-jwt-secret-here
```

## 5. Default Admin User

The setup script creates a default admin user:
- Email: admin@example.com
- ID: 550e8400-e29b-41d4-a716-446655440000
- Role: admin

You can modify these in the SQL script before running it.

## Troubleshooting

- Make sure PostgreSQL is running: `sudo systemctl status postgresql`
- Check PostgREST logs: `sudo journalctl -u postgrest -f`
- Verify database connection: `psql -U NotifUsr675 -d db_notifusr675 -c "SELECT version();"`
- Test PostgREST API: `curl http://localhost:3000/profiles`
