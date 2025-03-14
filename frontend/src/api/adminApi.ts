import axios from "axios";

const BASE_URL = "http://localhost:3000/api/admin";

const adminApi = {
    addBook: async (bookData: {
        title: string;
        author: string;
        genre: string;
        description?: string;
        status?: string;
    }, token: string) => {
        console.log("📢 addBook: Sending request with token:", token); // 🔍 Debugging
        const response = await axios.post(`${BASE_URL}/books`, bookData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateBook: async (bookId: number, bookData: {
        title?: string;
        author?: string;
        genre?: string;
        description?: string;
        status?: string;
    }, token: string) => {
        console.log("📢 updateBook: Sending request with token:", token); // 🔍 Debugging
        const response = await axios.put(`${BASE_URL}/books/${bookId}`, bookData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteBook: async (bookId: number, token: string) => {
        console.log("📢 deleteBook: Sending request with token:", token); // 🔍 Debugging
        const response = await axios.delete(`${BASE_URL}/books/${bookId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    approveBorrowRequest: async (bookId: number, token: string) => {
        console.log("📢 approveBorrowRequest: Sending request with token:", token); // 🔍 Debugging
        const response = await axios.put(`${BASE_URL}/book-requests/${bookId}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    denyBorrowRequest: async (bookId: number, denialReason: string, token: string) => {
        console.log("📢 denyBorrowRequest: Sending request with token:", token, "Reason:", denialReason); // 🔍 Debugging
        const response = await axios.put(`${BASE_URL}/book-requests/${bookId}/deny`,
            { denial_reason: denialReason },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    getAllBorrowRequests: async (token: string) => {
        console.log("📢 getAllBorrowRequests: Sending request with token:", token); // 🔍 Debugging
        const response = await axios.get(`${BASE_URL}/book-requests/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

};

export default adminApi;