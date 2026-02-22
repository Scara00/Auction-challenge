import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig, type AxiosRequestConfig, type AxiosResponse } from 'axios';


// Configurazione base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-challenge.icib.dev/';

// Creazione istanza axios
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - aggiungi token se presente
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - gestione errori
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Gestione errore di autenticazione
        if (error.response?.status === 401) {
            // Rimuovi token non valido
            localStorage.removeItem('authToken');

            // Redirect alla pagina di login o mostra messaggio
            console.error('Autenticazione fallita. Effettua nuovamente il login.');

            // Opzionale: redirect automatico
            window.location.href = '/login';
        }

        // Gestione altri errori comuni
        if (error.response?.status === 403) {
            console.error('Accesso negato. Non hai i permessi necessari.');
            localStorage.removeItem('authToken');

            // Redirect alla pagina di login o mostra messaggio
            console.error('Autenticazione fallita. Effettua nuovamente il login.');

            // Opzionale: redirect automatico
            window.location.href = '/login';
        }

        if (error.response?.status === 404) {
            console.error('Risorsa non trovata.');
        }

        if (error.response?.status === 500) {
            console.error('Errore del server. Riprova più tardi.');
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


export default apiClient;
