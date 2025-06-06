declare global {
  interface Window {
    env: {
      BACKEND_URL: string;
    };
  }
}

export const environment = {
  production: false,
  apiUrl: window.env?.BACKEND_URL || window.location.origin.includes('localhost') 
    ? 'http://localhost:8080/api'
    : `${window.location.origin}/api`
};
