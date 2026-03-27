import { useState, useEffect } from 'react';
import { INITIAL_BOOKS } from './shared/mockData';
import type { Book, AppMessage } from './shared/types';
import { WebApp } from './web/WebApp';
import { MobileApp } from './mobile/MobileApp';
import { StudentMobileApp } from './mobile/StudentMobileApp';
import { DesktopPWA } from './desktop/DesktopPWA';
import { Showcase } from './Showcase';

/**
 * App router: ?view=web|app|student|desktop|showcase
 */
export default function App() {
    const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') ?? 'showcase';

    useEffect(() => {
        const handler = (e: MessageEvent<AppMessage>) => {
            if (e.data?.type === 'BOOK_UPDATE') {
                const updatedBook = e.data.book;
                setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
                if (window.parent !== window) window.parent.postMessage(e.data, '*');
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    const handleBookUpdate = (updated: Book) => {
        setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
        const msg: AppMessage = { type: 'BOOK_UPDATE', book: updated };
        if (window.parent !== window) window.parent.postMessage(msg, '*');
    };

    if (view === 'app') return <MobileApp books={books} onBookUpdate={handleBookUpdate} />;
    if (view === 'web') return <WebApp books={books} />;
    if (view === 'student') return <StudentMobileApp books={books} />;
    if (view === 'desktop') return <DesktopPWA books={books} onBookUpdate={handleBookUpdate} />;
    return <Showcase />;
}
