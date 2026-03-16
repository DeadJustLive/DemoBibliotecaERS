// Tipos compartidos entre el catálogo web y la app admin
export interface Book {
    id: string;
    isbn: string;
    title: string;
    author: string;
    description: string;
    category: string;
    image: string;
    totalStock: number;
    availableCopies: number;
    status: 'available' | 'low_stock' | 'out_of_stock' | 'maintenance';
    isFeatured: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'librarian' | 'admin';
    idNumber: string;
}

export interface Loan {
    id: string;
    userId: string;
    userName: string;
    bookId: string;
    bookTitle: string;
    startDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: 'active' | 'returned' | 'overdue';
    penalty?: number;
}

// Mensaje postMessage entre web ↔ app
export type AppMessage = 
    | { type: 'BOOK_UPDATE'; book: Book }
    | { type: 'LOAN_UPDATE'; loan: Loan }
    | { type: 'RESERVATION'; bookId: string; userId: string };

