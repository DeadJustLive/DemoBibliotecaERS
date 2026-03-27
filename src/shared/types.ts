// Tipos compartidos entre todas las apps del sistema SGBU

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
    faculty?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'librarian' | 'admin';
    idNumber: string;
    faculty?: string;
    semester?: number;
    avatar?: string;
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

export interface StudyRoom {
    id: string;
    name: string;
    capacity: number;
    floor: number;
    equipment: string[];
    available: boolean;
    currentUser?: string;
    nextAvailable?: string;
}

export interface AcademicEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: 'workshop' | 'seminar' | 'expo' | 'conference';
    speaker?: string;
}

export interface DigitalResource {
    id: string;
    name: string;
    type: 'database' | 'journal' | 'ebook' | 'repository';
    description: string;
    url: string;
    accessLevel: 'open' | 'institutional';
    icon: string;
}

// Mensaje postMessage entre web ↔ app
export type AppMessage = 
    | { type: 'BOOK_UPDATE'; book: Book }
    | { type: 'LOAN_UPDATE'; loan: Loan }
    | { type: 'RESERVATION'; bookId: string; userId: string };
