import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Axios instance with auth and interceptors
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');  // clear stored user too
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// =========================
// Auth APIs
// =========================
export const registerUser = (data: any) => api.post('/auth/register', data);
export const loginUser = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const fetchUserById = (id: number) => api.get(`/auth/${id}`);

export const getCurrentUser = () => {
    const token = localStorage.getItem("token");
    return axios.get("/api/auth/current-user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}; // Assuming you add this route

// =========================
// Books APIs
// =========================
export const getBooks = (params: { page?: number; limit?: number; search?: string }) =>
    api.get('/books', { params });

export const getBookById = (id: number) => api.get(`/books/${id}`);

export const addBook = (data: any) => api.post('/books', data);

export const getBooksByOwner = async (owner_id: number) => {
    return await api.get(`/books/owned/${owner_id}`);
};


// =========================
// Shelf APIs
// =========================
export const getShelf = (userId: number) => api.get(`/shelf/${userId}`);


// =========================
// Borrow APIs (Non-Admin)
// =========================
export const requestBorrowBook = (book_id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Unauthorized: Please log in again.");
        return Promise.reject("No token found");
    }

    return api.post(`/books/${book_id}/request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getUserBorrowRequests = () =>
    api.get(`/borrow/requests`);

export const getBorrowedBooks = (user_id: number) =>
    api.get(`/borrowed/${user_id}`);