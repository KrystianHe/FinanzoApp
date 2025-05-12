declare global {
  interface Window {
    env: {
      BACKEND_URL: string;
    };
  }
}

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
}; 