// JWT Token Management
class JwtAuth {
    constructor() {
        this.baseUrl = '/api/auth';
        this.accessTokenKey = 'zedcars_access_token';
        this.refreshTokenKey = 'zedcars_refresh_token';
    }

    // Store tokens in localStorage
    storeTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    // Get access token
    getAccessToken() {
        return localStorage.getItem(this.accessTokenKey);
    }

    // Get refresh token
    getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }

    // Clear all tokens
    clearTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    // Login via JWT API
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                this.storeTokens(data.accessToken, data.refreshToken);
                return { success: true, user: data.user };
            } else {
                const error = await response.json();
                return { success: false, message: error.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    // Refresh access token
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                this.storeTokens(data.accessToken, data.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
        
        this.clearTokens();
        return false;
    }

    // Make authenticated API request
    async apiRequest(url, options = {}) {
        let accessToken = this.getAccessToken();
        
        if (!accessToken) {
            throw new Error('No access token available');
        }

        // Add authorization header
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        };

        let response = await fetch(url, options);

        // If token expired, try to refresh
        if (response.status === 401) {
            const refreshed = await this.refreshToken();
            if (refreshed) {
                // Retry with new token
                options.headers['Authorization'] = `Bearer ${this.getAccessToken()}`;
                response = await fetch(url, options);
            } else {
                // Redirect to login
                window.location.href = '/Account/Login';
                return;
            }
        }

        return response;
    }

    // Logout
    async logout() {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
            try {
                // Call API to revoke token
                await fetch(`${this.baseUrl}/revoke`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getAccessToken()}`
                    },
                    body: JSON.stringify({ refreshToken })
                });
            } catch (error) {
                console.error('Token revoke error:', error);
            }
        }
        
        this.clearTokens();
    }

    // Logout and redirect (for form logout)
    async logoutAndRedirect() {
        await this.logout();
        window.location.href = '/Account/Login';
    }
}

// Global instance
window.jwtAuth = new JwtAuth();
