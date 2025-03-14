export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;  // Optional since you probably won't fetch passwords
    user_type: 'USER' | 'ADMIN';
    profile_picture?: string;
    date_registered: string;  // ISO date string
}

export interface Book {
    book_id: number;
    title: string;
    author: string;
    genre?: string;
    publication_date?: string;  // ISO date string
    cover_image?: string;
    synopsis?: string;
    owner_id: number;
    status: 'Available' | 'Borrowed' | 'Requested';
    borrowedCount: number;
}

export interface BorrowTransaction {
    transaction_id: number;
    user_id: number;
    book_id: number;
    status: 'Requested' | 'Approved' | 'Denied';
    borrow_date: string;  // ISO date string
    return_date: string;  // ISO date string
}

export interface Saved {
    saved_id: number;
    user_id: number;
}

export interface Shelf {
    shelf_id: number;
    user_id: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}