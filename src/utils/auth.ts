import { createAuth0Client } from '@auth0/auth0-spa-js';
import { UserData } from 'auth0';

class Auth {
  private _auth = undefined;
  private _user: UserData = undefined;

  public async init() {
    await this.buildauth();
    
    const isAuthenticated = await this._auth.isAuthenticated();
    await this.handleRedirectCallback(isAuthenticated);
    
    // force user auth
    if (!isAuthenticated) {
      await this._auth.loginWithRedirect();
    }
    localStorage.setItem('token', await this._auth.getTokenSilently());
    this._user = await this._auth.getUser();
  }

  private async buildauth() {
    // Wait for callback from tauri oauth plugin
    this._auth = await createAuth0Client({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      cacheLocation: 'localstorage',
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE,
        redirect_uri: window.location.origin
      }
    });
  }

  private async handleRedirectCallback(isAuthenticated: boolean) {
    if (isAuthenticated) return;
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await this._auth.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/");
    }
  }

  public async logout() {
    await this._auth.logout({
      returnTo: window.location.origin
    });
    localStorage.removeItem('token');
  }

  public get user() {
    return this._user;
  }
}

export const auth = new Auth();