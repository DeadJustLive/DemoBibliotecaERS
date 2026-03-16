import type { Book, Loan, User } from './types';

// ── Libros mock ──────────────────
export const INITIAL_BOOKS: Book[] = [
    {
        id: "b1",
        isbn: "978-0141187761",
        title: "1984",
        author: "George Orwell",
        description: "Una novela distópica clásica sobre vigilancia gubernamental y control totalitario.",
        category: "Ficción",
        image: "https://placehold.co/800x600/2c3e50/ecf0f1?text=1984",
        totalStock: 5,
        availableCopies: 3,
        status: 'available',
        isFeatured: true,
    },
    {
        id: "b2",
        isbn: "978-0307474728",
        title: "Cien Años de Soledad",
        author: "Gabriel García Márquez",
        description: "La obra maestra del realismo mágico que narra la historia de la familia Buendía en Macondo.",
        category: "Literatura Latina",
        image: "https://placehold.co/800x600/f1c40f/2c3e50?text=Cien+Años+de+Soledad",
        totalStock: 8,
        availableCopies: 8,
        status: 'available',
        isFeatured: true,
    },
    {
        id: "b3",
        isbn: "978-0618260300",
        title: "El Señor de los Anillos: La Comunidad del Anillo",
        author: "J.R.R. Tolkien",
        description: "El comienzo de la épica aventura para destruir el Anillo Único.",
        category: "Fantasía",
        image: "https://placehold.co/800x600/27ae60/ffffff?text=El+Señor+de+los+Anillos",
        totalStock: 4,
        availableCopies: 0,
        status: 'out_of_stock',
        isFeatured: false,
    },
    {
        id: "b4",
        isbn: "978-0131103627",
        title: "The C Programming Language",
        author: "Kernighan & Ritchie",
        description: "La biblia del lenguaje C para programadores y entusiastas del software.",
        category: "Tecnología",
        image: "https://placehold.co/800x600/34495e/ffffff?text=C+Language",
        totalStock: 3,
        availableCopies: 2,
        status: 'available',
        isFeatured: false,
    },
    {
        id: "b5",
        isbn: "978-1501142970",
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        description: "Una estrella de Hollywood relata su escandalosa y glamurosa vida.",
        category: "Romance / Drama",
        image: "https://placehold.co/800x600/e91e63/ffffff?text=Evelyn+Hugo",
        totalStock: 10,
        availableCopies: 1,
        status: 'low_stock',
        isFeatured: true,
    },
];

// Usuarios mock
export const MOCK_USERS: User[] = [
    { id: "u1", name: "Valentina Soto", email: "v.soto@u.edu", role: "student", idNumber: "2023001" },
    { id: "u2", name: "Carlos Ruiz", email: "c.ruiz@u.edu", role: "librarian", idNumber: "L-501" },
    { id: "u3", name: "Admin General", email: "admin@u.edu", role: "admin", idNumber: "A-001" },
];

// Préstamos mock
export const MOCK_LOANS: Loan[] = [
    {
        id: "L-001",
        userId: "u1",
        userName: "Valentina Soto",
        bookId: "b3",
        bookTitle: "El Señor de los Anillos: La Comunidad del Anillo",
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "active",
    },
    {
        id: "L-002",
        userId: "u1",
        userName: "Valentina Soto",
        bookId: "b1",
        bookTitle: "1984",
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: "overdue",
        penalty: 2500,
    },
    {
        id: "L-003",
        userId: "u2",
        userName: "Carlos Ruiz",
        bookId: "b2",
        bookTitle: "Cien Años de Soledad",
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        returnDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: "returned",
    },
];

