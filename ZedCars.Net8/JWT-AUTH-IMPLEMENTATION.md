# JWT Authentication Implementation with Password Hashing

## What Was Implemented

### 1. Password Hashing
- Uses ASP.NET Core Identity's `PasswordHasher<Admin>`
- PBKDF2 algorithm with automatic salt generation
- All new passwords are automatically hashed
- Existing passwords need migration (see steps below)

### 2. One Token Per User
- Unique constraint on `RefreshTokens.AdminId`
- Existing token is updated on each login (not created new)
- Prevents 200+ token entries per user

### 3. Industry-Standard Architecture
- **AuthService**: Centralized authentication logic
- **IAuthService**: Clean interface for auth operations
- **TokenResponse**: Standardized response format
- **Separation of Concerns**: Auth logic separated from controllers

## Files Created/Modified

### New Files:
- `Services/AuthService.cs` - Main authentication service
- `Services/Interfaces/IAuthService.cs` - Auth service interface
- `Controllers/MigrationController.cs` - Password migration endpoint
- `cleanup-refresh-tokens.sql` - SQL script to clean duplicates

### Modified Files:
- `Services/AdminRepository.cs` - Added password hashing
- `Controllers/AuthController.cs` - Updated to use AuthService
- `Data/ZedCarsContext.cs` - Added unique constraint
- `Program.cs` - Registered new services

## Setup Instructions

### Step 1: Clean Up Duplicate Tokens

Run the SQL script to remove duplicate refresh tokens:

```bash
mysql -u zoomcars_user -padmin123 zoomcars_inventory < cleanup-refresh-tokens.sql
```

### Step 2: Create Migration

```bash
dotnet ef migrations add AddUniqueConstraintToRefreshToken
dotnet ef database update
```

### Step 3: Hash Existing Passwords

**Option A: Using Migration Endpoint (Recommended)**

1. Start the application:
```bash
dotnet run
```

2. Call the migration endpoint:
```bash
curl -X POST "https://localhost:5001/api/Migration/hash-passwords?secret=migrate-zedcars-2024"
```

3. Verify migration:
```bash
curl -X GET "https://localhost:5001/api/Migration/check-passwords?secret=migrate-zedcars-2024"
```

4. **IMPORTANT**: Delete `Controllers/MigrationController.cs` after migration is complete

**Option B: Manual Database Update**

If you prefer, you can manually update passwords in the database, but this is NOT recommended as you'd need to generate hashes manually.

### Step 4: Test Authentication

Test the new authentication flow:

```bash
# Login
curl -X POST https://localhost:5001/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Response will include:
# - accessToken (15 min expiry)
# - refreshToken (7 day expiry)
# - user info

# Refresh Token
curl -X POST https://localhost:5001/api/Auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# Logout
curl -X POST https://localhost:5001/api/Auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## API Endpoints

### POST /api/Auth/login
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "base64string...",
  "expiresIn": 900,
  "user": {
    "adminId": 1,
    "username": "admin",
    "email": "admin@zedcars.com",
    "fullName": "Admin User",
    "role": "SuperAdmin"
  }
}
```

### POST /api/Auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "base64string..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "new_base64string...",
  "expiresIn": 900,
  "user": { ... }
}
```

### POST /api/Auth/register
Register new user (automatically hashes password).

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

### POST /api/Auth/logout
Logout and revoke all user tokens (requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## How It Works

### Login Flow:
1. User submits username/password
2. `AuthService.LoginAsync()` validates credentials using `PasswordHasher`
3. If valid, generates new access token (15 min) and refresh token (7 days)
4. Checks if user already has a refresh token in database
5. If exists, updates it; if not, creates new one
6. Returns tokens and user info

### Token Refresh Flow:
1. Client sends expired access token + valid refresh token
2. `AuthService.RefreshTokenAsync()` validates refresh token
3. If valid and not expired, generates new token pair
4. Updates refresh token in database
5. Returns new tokens

### Password Hashing:
- **On Registration**: Password is hashed before saving
- **On Login**: Stored hash is compared with provided password
- **On Update**: If password field is provided, it's hashed before saving

## Security Features

1. **Password Hashing**: PBKDF2 with automatic salt
2. **Token Expiry**: Access tokens expire in 15 minutes
3. **Refresh Token Rotation**: New refresh token on each refresh
4. **One Token Per User**: Prevents token accumulation
5. **Token Revocation**: Logout removes all user tokens
6. **Active User Check**: Only active users can authenticate

## Database Schema

### RefreshTokens Table:
```sql
CREATE TABLE RefreshTokens (
  Id INT PRIMARY KEY AUTO_INCREMENT,
  AdminId INT NOT NULL UNIQUE,  -- One token per user
  Token VARCHAR(255) NOT NULL,
  ExpiryDate DATETIME NOT NULL,
  CreatedDate DATETIME NOT NULL,
  IsRevoked BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (AdminId) REFERENCES Admins(AdminId) ON DELETE CASCADE
);
```

## Troubleshooting

### Issue: "Invalid credentials" on login
- Check if passwords have been migrated (use check-passwords endpoint)
- Verify user exists and is active in database

### Issue: "Invalid refresh token"
- Token may have expired (7 day limit)
- Token may have been revoked
- User may have been deactivated

### Issue: Migration fails with duplicate key error
- Run cleanup-refresh-tokens.sql first
- Ensure no duplicate AdminId entries in RefreshTokens table

### Issue: Still creating multiple tokens per user
- Verify migration was applied: `dotnet ef migrations list`
- Check unique constraint exists: `SHOW INDEX FROM RefreshTokens;`

## Next Steps

After successful implementation:

1. ✅ Delete `Controllers/MigrationController.cs`
2. ✅ Update frontend to use new auth endpoints
3. ✅ Implement token refresh logic in frontend
4. ✅ Store tokens securely (httpOnly cookies or secure storage)
5. ✅ Add token refresh interceptor for API calls
6. ✅ Implement logout on all devices feature (if needed)

## Notes

- Access tokens are short-lived (15 min) for security
- Refresh tokens are long-lived (7 days) for convenience
- Tokens are automatically rotated on refresh
- Old refresh token is invalidated when new one is issued
- All passwords are now hashed - no plain text storage
