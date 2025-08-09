class FaceitAuth {
    constructor() {
        this.apiBase = window.location.origin;
        this.user = null;
        this.isLoading = true;
        
        this.initElements();
        this.bindEvents();
        this.checkAuthStatus();
        this.handleCallback();
    }
    
    initElements() {
        this.elements = {
            loading: document.getElementById('loading'),
            loginSection: document.getElementById('login-section'),
            userSection: document.getElementById('user-section'),
            loginBtn: document.getElementById('login-btn'),
            logoutBtn: document.getElementById('logout-btn'),
            userAvatar: document.getElementById('user-avatar'),
            userNickname: document.getElementById('user-nickname'),
            userLevel: document.getElementById('user-level'),
            userProfile: document.getElementById('user-profile'),
            userData: document.getElementById('user-data'),
            errorMessage: document.getElementById('error-message')
        };
    }
    
    bindEvents() {
        this.elements.loginBtn.addEventListener('click', () => this.login());
        this.elements.logoutBtn.addEventListener('click', () => this.logout());
    }
    
    async checkAuthStatus() {
        try {
            const response = await fetch(`${this.apiBase}/api/auth/user`);
            const data = await response.json();
            
            if (data.user) {
                this.setUser(data.user);
            } else {
                this.setUser(null);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            this.setUser(null);
        } finally {
            this.isLoading = false;
            this.updateUI();
        }
    }
    
    handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
            const errorMessages = {
                no_code: 'No authorization code received from FACEIT',
                no_verifier: 'Session expired. Please try logging in again',
                token_failed: 'Failed to exchange authorization code for access token',
                profile_failed: 'Failed to retrieve user profile from FACEIT',
                auth_failed: 'Authentication failed. Please try again'
            };
            
            this.showError(errorMessages[error] || 'Authentication failed');
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    async login() {
        try {
            // Redirect to backend login endpoint
            window.location.href = `${this.apiBase}/api/auth/faceit`;
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Failed to initiate login process');
        }
    }
    
    async logout() {
        try {
            const response = await fetch(`${this.apiBase}/api/auth/logout`, {
                method: 'POST'
            });
            
            if (response.ok) {
                this.setUser(null);
                this.updateUI();
                // Optionally redirect to home
                window.location.href = '/';
            } else {
                this.showError('Failed to logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
            this.showError('Failed to logout');
        }
    }
    
    setUser(user) {
        this.user = user;
        this.hideError();
        
        if (user) {
            this.elements.userAvatar.src = user.avatar;
            this.elements.userNickname.textContent = user.nickname;
            this.elements.userLevel.textContent = user.level ? `Level ${user.level}` : '';
            this.elements.userData.textContent = JSON.stringify(user, null, 2);
        }
    }
    
    updateUI() {
        if (this.isLoading) {
            this.elements.loading.classList.remove('hidden');
            this.elements.loginSection.classList.add('hidden');
            this.elements.userSection.classList.add('hidden');
            this.elements.userProfile.classList.add('hidden');
        } else if (this.user) {
            this.elements.loading.classList.add('hidden');
            this.elements.loginSection.classList.add('hidden');
            this.elements.userSection.classList.remove('hidden');
            this.elements.userProfile.classList.remove('hidden');
        } else {
            this.elements.loading.classList.add('hidden');
            this.elements.loginSection.classList.remove('hidden');
            this.elements.userSection.classList.add('hidden');
            this.elements.userProfile.classList.add('hidden');
        }
    }
    
    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
    }
    
    hideError() {
        this.elements.errorMessage.classList.add('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FaceitAuth();
});