declare global {
  interface Window {
    env: {
      BACKEND_URL: string;
    };
  }
}

export const environment = {
  production: false,
  apiUrl: window.env?.BACKEND_URL || 'https://finanzoapp-backend-production.up.railway.app/api'
}; 