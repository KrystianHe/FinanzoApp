import axios from 'axios';

// Funkcje pomocnicze do zarządzania tokenami
const getToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (token, refreshToken) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
};
const removeTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

// Utwórz instancję do odświeżania tokenów (bez interceptorów, aby uniknąć nieskończonej pętli)
const refreshApi = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Funkcja do odświeżania tokenu
const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('Brak tokenu odświeżającego');
    }
    
    const response = await refreshApi.post('/auth/refresh-token', { refreshToken });
    const { token, refreshToken: newRefreshToken } = response.data;
    
    // Zapisz nowe tokeny
    setTokens(token, newRefreshToken);
    return token;
  } catch (error) {
    // W przypadku błędu odświeżania, wyloguj użytkownika
    removeTokens();
    window.location.href = '/login';
    throw error;
  }
};

// Konfiguracja bazowa axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dodajemy interceptor, który będzie dodawał token JWT z localStorage do każdego zapytania
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flaga informująca, czy trwa odświeżanie tokenu
let isRefreshing = false;
// Kolejka opóźnionych żądań czekających na nowy token
let refreshSubscribers = [];

// Funkcja do odświeżania tokenu i ponawiania nieudanych żądań
const onRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Funkcja do dodawania żądań do kolejki oczekujących
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Dodajemy interceptor dla odpowiedzi, aby obsługiwał błędy autoryzacji (401)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Jeśli błąd 401 i żądanie nie jest żądaniem odświeżenia tokenu i nie było już ponawiane
    if (error.response && error.response.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('auth/refresh-token')) {
      
      // Oznaczamy, że żądanie jest już ponawiane
      originalRequest._retry = true;
      
      // Jeśli nie trwa jeszcze odświeżanie tokenu, zainicjuj je
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          // Odśwież token
          const newToken = await refreshToken();
          
          // Powiadom oczekujące żądania o nowym tokenie
          onRefreshed(newToken);
          
          // Zaktualizuj nagłówek autoryzacji w oryginalnym żądaniu
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Ponów oryginalne żądanie
          return api(originalRequest);
        } catch (refreshError) {
          // Jeśli odświeżanie nie powiodło się, wyloguj użytkownika
          removeTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Jeśli odświeżanie tokenu już trwa, dodaj oryginalne żądanie do kolejki
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Serwis do obsługi transakcji
export const transactionService = {
  // Pobieranie wszystkich transakcji użytkownika
  getAllTransactions: async () => {
    try {
      const response = await api.get('/transactions');
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania transakcji:', error);
      throw error;
    }
  },

  // Pobieranie transakcji z określonego zakresu dat
  getTransactionsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get('/transactions/date-range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania transakcji wg zakresu dat:', error);
      throw error;
    }
  },

  // Pobieranie pojedynczej transakcji
  getTransactionById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania transakcji o ID ${id}:`, error);
      throw error;
    }
  },

  // Dodawanie nowej transakcji
  addTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas dodawania transakcji:', error);
      throw error;
    }
  },

  // Aktualizacja istniejącej transakcji
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas aktualizacji transakcji o ID ${id}:`, error);
      throw error;
    }
  },

  // Usuwanie transakcji
  deleteTransaction: async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      return true;
    } catch (error) {
      console.error(`Błąd podczas usuwania transakcji o ID ${id}:`, error);
      throw error;
    }
  },

  // Filtrowanie transakcji
  filterTransactions: async (filterData) => {
    try {
      const response = await api.post('/transactions/filter', filterData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas filtrowania transakcji:', error);
      throw error;
    }
  },

  // Pobieranie podsumowania transakcji
  getTransactionSummary: async (startDate, endDate) => {
    try {
      const response = await api.get('/transactions/summary', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania podsumowania transakcji:', error);
      throw error;
    }
  },

  // Pobieranie statystyk transakcji
  getTransactionStats: async (startDate, endDate) => {
    try {
      const response = await api.get('/transactions/stats', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk transakcji:', error);
      throw error;
    }
  },

  // Pobieranie miesięcznego podsumowania transakcji
  getMonthlyTransactionSummary: async (startDate, endDate) => {
    try {
      const response = await api.get('/transactions/monthly-summary', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania miesięcznego podsumowania:', error);
      throw error;
    }
  },
  
  // Pobieranie transakcji z paginacją i filtrowaniem
  getTransactions: async (params) => {
    try {
      const response = await api.get('/transactions/paginated', { params });
      return response.data;
    } catch (error) {
      console.error('Błąd podczas pobierania transakcji z paginacją:', error);
      throw error;
    }
  },
  
  // Eksport transakcji
  exportTransactions: async () => {
    try {
      const response = await api.get('/transactions/export', { 
        responseType: 'blob' 
      });
      
      // Tworzenie linku do pobrania pliku
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transakcje.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Błąd podczas eksportu transakcji:', error);
      throw error;
    }
  }
};

// Serwis do obsługi autoryzacji
export const authService = {
  // Logowanie
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Zapisz oba tokeny w localStorage
      setTokens(response.data.token, response.data.refreshToken);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas logowania:', error);
      throw error;
    }
  },
  
  // Rejestracja
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas rejestracji:', error);
      throw error;
    }
  },
  
  // Aktywacja konta
  activateAccount: async (activationData) => {
    try {
      const response = await api.post('/auth/activate', activationData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas aktywacji konta:', error);
      throw error;
    }
  },
  
  // Weryfikacja kodu
  verifyCode: async (verificationData) => {
    try {
      const response = await api.post('/auth/verify', verificationData);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas weryfikacji kodu:', error);
      throw error;
    }
  },
  
  // Ponowne wysłanie kodu weryfikacyjnego
  resendCode: async (email) => {
    try {
      const response = await api.post(`/auth/resend-code?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Błąd podczas wysyłania kodu weryfikacyjnego:', error);
      throw error;
    }
  },
  
  // Wylogowanie
  logout: () => {
    removeTokens();
    window.location.href = '/login';
  },
  
  // Sprawdzenie czy użytkownik jest zalogowany
  isAuthenticated: () => {
    return !!getToken();
  }
};

// Helper do formatowania danych transakcji z backendu do frontendu
export const transactionMapper = {
  // Mapowanie danych z API do formatu używanego w fronendzie
  toFrontendModel: (transaction) => {
    return {
      id: transaction.id,
      title: transaction.name,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category.toLowerCase(),
      type: transaction.type === 'INCOME' ? 'income' : 'expense',
      description: transaction.description || ''
    };
  },

  // Mapowanie z formatu frontendu do API
  toApiModel: (transaction) => {
    return {
      id: transaction.id,
      name: transaction.title,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
      type: transaction.type === 'income' ? 'INCOME' : 'EXPENSE',
      description: transaction.description,
      budgetId: transaction.budgetId
    };
  },

  // Konwersja listy transakcji
  mapTransactionList: (transactions) => {
    return transactions.map(transactionMapper.toFrontendModel);
  }
};

export default api; 