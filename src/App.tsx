import { useState, useEffect } from 'react';
import { INITIAL_BOOKS } from './shared/mockData';
import type { Book, AppMessage } from './shared/types';
import { WebApp } from './web/WebApp';
import { MobileApp } from './mobile/MobileApp';
import { Showcase } from './Showcase';

/**
 * App router: lee el query param ?view=web|app|showcase
 *  - ?view=web       → catálogo web (estudiante)
 *  - ?view=app       → admin móvil (bibliotecario)
 *  - ?view=showcase  → vista doble (demo)
 */
export default function App() {
    const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);

    // Detectar si estamos en iframe o ventana directa
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') ?? 'showcase';

    // Escuchar mensajes (para sincronizar entre el administrador móvil y el catálogo web)
    useEffect(() => {
        const handler = (e: MessageEvent<AppMessage>) => {
            if (e.data?.type === 'BOOK_UPDATE') {
                const updatedBook = e.data.book;
                setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
                
                // Si este mensaje llegó a un iframe, propagarlo al padre (showcase) si existe
                if (window.parent !== window) {
                   window.parent.postMessage(e.data, '*');
                }
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    // Enviar mensajes a otros iframes comunicándose con el padre
    const broadcastChange = (msg: AppMessage) => {
        if (window.parent !== window) {
            window.parent.postMessage(msg, '*');
        }
    };

    // Callback del admin: actualiza local + emite postMessage
    const handleBookUpdate = (updated: Book) => {
        setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
        const msg: AppMessage = { type: 'BOOK_UPDATE', book: updated };
        
        // Notificar a otros (si estamos en iframe)
        broadcastChange(msg);
        
        // También intentar notificar directamente si tenemos referencias (poco probable sin manejo manual)
        // Pero el postMessage al padre se encargará de re-emitir el mensaje.
    };

    if (view === 'app') {
        return <MobileApp books={books} onBookUpdate={handleBookUpdate} />;
    }

    if (view === 'web') {
        return <WebApp books={books} />;
    }

    return <Showcase />;
}
