# Admin User Creation Script

This script helps you create the first admin user for the TradeFlow application.

## Usage

### Basic Usage (with default values)
```bash
npm run create-admin
```

This will create an admin user with:
- **Name**: Admin User
- **Email**: admin@tradeflow.com
- **Password**: admin123

### Custom Admin User
```bash
npm run create-admin "Your Name" "your-email@example.com" "your-password"
```

Example:
```bash
npm run create-admin "John Doe" "john@admin.com" "SecurePass123!"
```

### Update Existing User to Admin
If a user with the email already exists but is not an admin, you can convert them:
```bash
npm run create-admin "User Name" "existing@email.com" "new-password" --update
```

## Important Notes

1. **Change Default Password**: After creating the admin user, make sure to change the default password through the admin settings or by updating it in the database.

2. **Security**: Never commit admin credentials to version control. Always use strong passwords in production.

3. **Environment**: Make sure your `.env` file has the correct `MONGO_URI` configured before running the script.

## Login

After creating the admin user, you can login at:
- **URL**: `http://localhost:5173/admin/login`
- Use the email and password you specified (or defaults if using basic usage)
