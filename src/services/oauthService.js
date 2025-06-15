class OAuthService {
  constructor() {
    this.googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
    this.apiURL = process.env.REACT_APP_BASE_URL_API;
  }

  // Initialize Google OAuth
  initializeGoogle() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: this.googleClientId,
          }).then(resolve, reject);
        });
      } else {
        reject(new Error('Google API not loaded'));
      }
    });
  }

  // Initialize Facebook SDK
  initializeFacebook() {
    return new Promise((resolve) => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: this.facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        resolve();
      };

      // Load Facebook SDK
      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        document.head.appendChild(script);
      }
    });
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      await this.initializeGoogle();
      const authInstance = window.gapi.auth2.getAuthInstance();
      const googleUser = await authInstance.signIn({
        scope: 'profile email'
      });
      
      const profile = googleUser.getBasicProfile();
      const idToken = googleUser.getAuthResponse().id_token;
      
      return {
        provider: 'google',
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
        token: idToken
      };
    } catch (error) {
      throw new Error(`Google sign-in failed: ${error.message}`);
    }
  }

  // Facebook Sign In
  async signInWithFacebook() {
    try {
      await this.initializeFacebook();
      
      return new Promise((resolve, reject) => {
        window.FB.login((response) => {
          if (response.authResponse) {
            window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo) => {
              resolve({
                provider: 'facebook',
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                picture: userInfo.picture?.data?.url,
                token: response.authResponse.accessToken
              });
            });
          } else {
            reject(new Error('Facebook login cancelled'));
          }
        }, { scope: 'email,public_profile' });
      });
    } catch (error) {
      throw new Error(`Facebook sign-in failed: ${error.message}`);
    }
  }

  // Send OAuth data to backend
  async authenticateWithBackend(oauthData, isSignup = false) {
    const endpoint = isSignup ? '/auth/oauth/signup' : '/auth/oauth/login';
    
    const response = await fetch(`${this.apiURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(oauthData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'OAuth authentication failed');
    }
    
    return data;
  }
}

export default new OAuthService();
