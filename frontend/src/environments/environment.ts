declare global {
  interface Window {
    env: {
      BACKEND_URL: string;
    };
  }
}

export const environment = {
  production: false,
  apiUrl: window.env?.BACKEND_URL || 'https://finanzo-backend.up.railway.app'
};
