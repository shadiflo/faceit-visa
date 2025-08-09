declare module 'express-session' {
  interface SessionData {
    user?: import('./index').FaceitUser;
    faceitToken?: import('./index').TokenResponse;
  }
}

export * from './index';
export * from './middleware';