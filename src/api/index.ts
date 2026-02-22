import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Configurazione base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-challenge.icib.dev/';

// Flag per evitare loop di refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Helper per leggere lo stato auth da localStorage
const getAuthState = () => {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return { isAuthenticated: false, authToken: null, refreshToken: null };

    try {
        const parsed = JSON.parse(authStorage);
        return {
            isAuthenticated: parsed?.state?.isAuthenticated === true,
            authToken: parsed?.state?.authToken,
            refreshToken: parsed?.state?.refreshToken,
        };
    } catch (e) {
        console.error('Errore parsing auth storage:', e);
        return { isAuthenticated: false, authToken: null, refreshToken: null };
    }
};

// Helper per aggiornare i token nello storage
const updateAuthTokens = (authToken: string, refreshToken: string) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            parsed.state.authToken = authToken;
            parsed.state.refreshToken = refreshToken;
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
        } catch (e) {
            console.error('Errore aggiornamento auth storage:', e);
        }
    }
};

// Helper per fare logout
const clearAuthStorage = () => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        try {
            const parsed = JSON.parse(authStorage);
            parsed.state.isAuthenticated = false;
            parsed.state.authToken = null;
            parsed.state.refreshToken = null;
            parsed.state.user = null;
            localStorage.setItem('auth-storage', JSON.stringify(parsed));
        } catch (e) {
            console.error('Errore clear auth storage:', e);
        }
    }
    sessionStorage.removeItem('accessToken');
};

// Creazione istanza axios
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - aggiungi token solo se utente autenticato
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { isAuthenticated, authToken } = getAuthState();

        // Aggiungi header Authorization solo se autenticato e token è una stringa valida
        if (isAuthenticated && authToken && typeof authToken === 'string' && authToken !== 'null' && authToken.trim() !== '' && config.headers) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - gestione errori e refresh token
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Gestione errore 401 - Token scaduto
        if (error.response?.status === 401 && !originalRequest._retry) {
            const { refreshToken, isAuthenticated } = getAuthState();

            // Se non è autenticato o non ha refresh token, non tentare il refresh
            if (!isAuthenticated || !refreshToken) {
                toast.error('Sessione scaduta', {
                    description: 'Effettua nuovamente il login.',
                });
                return Promise.reject(error);
            }

            // Se è già in corso un refresh, metti in coda la richiesta
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return apiClient(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Chiama l'API di refresh
                const response = await axios.post(`${BASE_URL}auth/refresh`, {
                    refreshToken,
                });

                const { accessToken: newAuthToken, refreshToken: newRefreshToken } = response.data;

                // Aggiorna i token nello storage
                updateAuthTokens(newAuthToken, newRefreshToken);
                sessionStorage.setItem('accessToken', newAuthToken);

                // Aggiorna l'header della richiesta originale
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAuthToken}`;
                }

                // Processa le richieste in coda
                processQueue(null, newAuthToken);

                // Riprova la richiesta originale
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh fallito - logout
                processQueue(refreshError as AxiosError, null);
                clearAuthStorage();

                toast.error('Sessione scaduta', {
                    description: 'Effettua nuovamente il login.',
                });

                // Redirect al login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Gestione altri errori con toast
        const errorMessage = getErrorMessage(error);

        if (error.response?.status === 403) {
            toast.error('Accesso negato', {
                description: 'Non hai i permessi necessari per questa azione.',
            });
        } else if (error.response?.status === 404) {
            toast.error('Non trovato', {
                description: 'La risorsa richiesta non esiste.',
            });
        } else if (error.response?.status === 500) {
            toast.error('Errore del server', {
                description: 'Si è verificato un errore. Riprova più tardi.',
            });
        } else if (error.response?.status && error.response.status >= 400) {
            toast.error('Errore', {
                description: errorMessage,
            });
        } else if (!error.response) {
            toast.error('Errore di connessione', {
                description: 'Verifica la tua connessione internet.',
            });
        }

        // Log errore per debugging
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
        });

        return Promise.reject(error);
    }
);

// Helper per estrarre il messaggio di errore dalla risposta
const getErrorMessage = (error: AxiosError): string => {
    const data = error.response?.data as any;

    if (data?.message) {
        return Array.isArray(data.message) ? data.message[0] : data.message;
    }

    if (data?.error) {
        return data.error;
    }

    return error.message || 'Si è verificato un errore imprevisto.';
};

export default apiClient;
