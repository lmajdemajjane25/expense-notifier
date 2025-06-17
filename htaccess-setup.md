
# Authentication Setup

This application now includes two layers of authentication:

## 1. HTTP Basic Authentication (Server-side - Optional)
- Username: `admin`
- Password: `secret`

## 2. Application-level Basic Authentication (Required)
The application now requires Basic Auth credentials to be set as environment variables.

### Required Environment Variables
```
VITE_BASIC_AUTH_USER=your_username
VITE_BASIC_AUTH_PASS=your_password
```

### Setting Up Application Basic Auth

1. **For Development:**
   - Update your `.env` file with your desired credentials
   - Replace `your_username` and `your_password` with your actual credentials

2. **For Production:**
   - Set the environment variables in your hosting platform
   - Ensure `VITE_BASIC_AUTH_USER` and `VITE_BASIC_AUTH_PASS` are configured

### How It Works
- Users must first authenticate with the application-level Basic Auth
- Only after passing this authentication can they access the login/signup forms
- Authentication is stored in sessionStorage for the current browser session

## HTTP Basic Authentication (Legacy .htaccess method)

### Default Credentials
- Username: `admin`
- Password: `secret`

### Customizing HTTP Basic Auth Credentials

To change the username and password:

1. Generate a new password hash using an online htpasswd generator or command line:
   ```bash
   htpasswd -c .htpasswd newusername
   ```

2. Or use an online generator like: https://www.web2generators.com/apache-tools/htpasswd-generator

3. Replace the content in `.htpasswd` with your new username:hash combination

### Important Notes

- The application-level Basic Auth takes precedence and is required
- The `.htaccess` file provides an additional server-level protection layer
- Users will see the application's custom login form for Basic Auth
- Make sure your web server supports .htaccess files if using HTTP Basic Auth
- Update the `AuthUserFile` path in `.htaccess` if your deployment path is different from `/var/www/html/`

### Deployment Instructions

1. Set the required environment variables (`VITE_BASIC_AUTH_USER` and `VITE_BASIC_AUTH_PASS`)
2. Optionally upload both `.htaccess` and `.htpasswd` files to your web server root directory
3. Ensure Apache has mod_rewrite and mod_auth enabled (if using .htaccess)
4. Make sure the .htpasswd file path in .htaccess matches your server structure (if using .htaccess)

### Security Considerations

- Application-level Basic Auth credentials are required for access
- The password is checked client-side, so use this for basic access control only
- Consider using HTTPS to protect credentials in transit
- For production environments, consider implementing server-side authentication
- You can add multiple users by implementing a user management system
