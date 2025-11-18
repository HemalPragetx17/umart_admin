# Security Configuration Guide

This project has been configured with comprehensive security headers to achieve a 100/100 security score.

## What Was Fixed

### 1. **Inline Scripts Removed**

- Moved all inline JavaScript to external file: `public/theme-script.js`
- This prevents XSS attacks and improves CSP compliance

### 2. **Security Headers Added**

The following security headers are now configured in `public/index.html`:

- **Content-Security-Policy (CSP)**: Prevents XSS, clickjacking, and code injection attacks
- **X-Frame-Options**: Prevents clickjacking by denying iframe embedding
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **Referrer-Policy**: Controls referrer information sent with requests
- **Permissions-Policy**: Restricts access to browser features (camera, microphone, etc.)
- **Cross-Origin-Embedder-Policy**: Requires resources to be same-origin or CORS-enabled
- **Cross-Origin-Opener-Policy**: Isolates browsing context from cross-origin windows
- **Cross-Origin-Resource-Policy**: Protects resources from being loaded by other origins

### 3. **Security.txt File**

- Added `public/.well-known/security.txt` for responsible security disclosure
- Update the contact email in this file with your actual security contact

### 4. **Server-Side Configuration Files**

Multiple configuration files created for different hosting platforms:

- **Apache**: `public/.htaccess`
- **Nginx**: `nginx-security-headers.conf`
- **Netlify**: `netlify.toml`
- **Vercel**: `vercel.json`
- **Generic**: `headers.config.js`

## Deployment Instructions

### For Development (localhost)

The meta tags in `index.html` will provide basic security headers.

### For Production

#### **Option 1: Netlify**

The `netlify.toml` file is already configured. Just deploy normally.

#### **Option 2: Vercel**

The `vercel.json` file is already configured. Just deploy normally.

#### **Option 3: Apache Server**

The `.htaccess` file in the `public` folder will be deployed with your build.
Ensure `mod_headers` and `mod_rewrite` are enabled:

```bash
a2enmod headers
a2enmod rewrite
systemctl restart apache2
```

#### **Option 4: Nginx**

Add the contents of `nginx-security-headers.conf` to your nginx server block:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # Include security headers
    include /path/to/nginx-security-headers.conf;

    # ... rest of your configuration
}
```

#### **Option 5: Custom Node Server**

Use the `headers.config.js` file with your custom server implementation.

### HTTPS Configuration (Critical!)

**Important**: For the `Strict-Transport-Security` header to work and achieve 100/100 score:

1. **Obtain an SSL/TLS certificate**:

   - Use Let's Encrypt (free): https://letsencrypt.org/
   - Or use Cloudflare SSL
   - Or purchase from a certificate authority

2. **Configure your web server** to use HTTPS:

   - All modern hosting platforms (Netlify, Vercel, etc.) provide free SSL automatically
   - For Apache/Nginx, configure SSL certificates in your server config

3. **Force HTTPS redirect**:
   - This is already configured in the `.htaccess` and nginx config files
   - Ensure all traffic is redirected from HTTP to HTTPS

## Content Security Policy (CSP) Adjustments

If you need to load resources from external domains (CDNs, APIs, etc.), you may need to adjust the CSP in `public/index.html`:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self'; 
  script-src 'self' https://trusted-cdn.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  img-src 'self' data: https:; 
  font-src 'self' data: https://fonts.gstatic.com; 
  connect-src 'self' https://your-api.com; 
  frame-ancestors 'none'; 
  base-uri 'self'; 
  form-action 'self';
"
/>
```

**Note**: Only add trusted domains to your CSP. Each domain you add slightly reduces security.

## Testing Your Security Score

1. Build your project: `npm run build`
2. Deploy to production with HTTPS enabled
3. Visit: https://security-copilot.link/ or https://securityheaders.com/
4. Enter your production URL
5. You should now see a score of 100/100 or A+

## Common Issues

### Issue: CSP Blocking Resources

**Solution**: Check browser console for CSP violations and add trusted domains to the CSP policy.

### Issue: HTTPS Headers Not Working

**Solution**: Ensure your site is served over HTTPS. The `Strict-Transport-Security` header only works with HTTPS.

### Issue: Inline Styles Blocked

**Solution**: Move inline styles to external CSS files, or use `'unsafe-inline'` for `style-src` (less secure).

### Issue: Third-party Scripts Blocked

**Solution**: Add the specific domain to `script-src` in your CSP policy.

## Security Checklist

- [x] Removed inline scripts
- [x] Added security meta tags
- [x] Created security.txt file
- [x] Configured server-side headers
- [ ] Enable HTTPS on production server
- [ ] Update security.txt with real contact email
- [ ] Test all pages to ensure no CSP violations
- [ ] Verify security score on production URL

## Files Modified/Created

- ✅ `public/index.html` - Added security meta tags, removed inline scripts
- ✅ `public/theme-script.js` - Extracted inline scripts
- ✅ `public/.well-known/security.txt` - Security disclosure contact
- ✅ `public/.htaccess` - Apache security headers
- ✅ `nginx-security-headers.conf` - Nginx security headers
- ✅ `netlify.toml` - Netlify deployment config
- ✅ `vercel.json` - Vercel deployment config
- ✅ `headers.config.js` - Generic headers config

## Additional Security Recommendations

1. **Keep dependencies updated**: Regularly run `npm audit` and update packages
2. **Use environment variables**: Never commit secrets or API keys
3. **Enable 2FA**: On your hosting platform and git repository
4. **Regular security audits**: Use tools like npm audit, Snyk, or OWASP ZAP
5. **Input validation**: Validate all user inputs on both client and server
6. **Rate limiting**: Implement rate limiting on your API endpoints
7. **CORS configuration**: Only allow trusted origins in your API CORS policy

## Support

If you encounter any issues with the security configuration, check:

1. Browser console for CSP violations
2. Network tab for blocked resources
3. Server logs for header configuration errors

---

**Last Updated**: November 2025
**Security Score Target**: 100/100 ✅
