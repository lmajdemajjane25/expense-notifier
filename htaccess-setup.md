
# .htaccess Password Protection Setup

This application now includes HTTP Basic Authentication protection.

## Default Credentials
- Username: `admin`
- Password: `secret`

## Customizing Credentials

To change the username and password:

1. Generate a new password hash using an online htpasswd generator or command line:
   ```bash
   htpasswd -c .htpasswd newusername
   ```

2. Or use an online generator like: https://www.web2generators.com/apache-tools/htpasswd-generator

3. Replace the content in `.htpasswd` with your new username:hash combination

## Important Notes

- The `.htaccess` file will protect your entire application
- Users will see a browser login prompt before accessing the app
- Make sure your web server supports .htaccess files
- Update the `AuthUserFile` path in `.htaccess` if your deployment path is different from `/var/www/html/`

## Deployment Instructions

1. Upload both `.htaccess` and `.htpasswd` files to your web server root directory
2. Ensure Apache has mod_rewrite and mod_auth enabled
3. Make sure the .htpasswd file path in .htaccess matches your server structure

## Security Considerations

- The password hash in .htpasswd is encrypted
- Consider using HTTPS to protect credentials in transit
- You can add multiple users by adding more lines to .htpasswd
