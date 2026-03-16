import { useState, useEffect } from 'react';
import {
    Library, BookOpen, Heart, Star, Instagram, Facebook,
    Menu, X, User, LogOut, Settings, Package, Headphones,
    ShieldCheck, CreditCard, Bookmark, ChevronRight, Trash2, Plus, Minus, Search, History, Clock
} from 'lucide-react';
import type { Book, Loan, User as UserType } from '../shared/types';

interface ReservationItem extends Book { qty: number; }

interface WebAppProps {
    books: Book[];
}

type Theme = 'slate' | 'indigo' | 'contrast';

const THEMES: Record<Theme, Record<string, string>> = {
    indigo: {
        '--color-brand-primary': '#4f46e5',
        '--color-brand-secondary': '#1e1b4b',
        '--color-brand-accent': '#818cf8',
        '--color-brand-background': '#fdfdff',
        '--color-brand-text': '#1e293b',
    },
    slate: {
        '--color-brand-primary': '#334155',
        '--color-brand-secondary': '#0f172a',
        '--color-brand-accent': '#94a3b8',
        '--color-brand-background': '#f8fafc',
        '--color-brand-text': '#0f172a',
    },
    contrast: {
        '--color-brand-primary': '#000000',
        '--color-brand-secondary': '#d97706',
        '--color-brand-accent': '#d97706',
        '--color-brand-background': '#ffffff',
        '--color-brand-text': '#000000',
    }
};

// ── Helpers ────────────────────────────────────────────────────────────────
const EMPRESA = 'SGBU - Biblioteca';

// ── WebApp ─────────────────────────────────────────────────────────────────
export function WebApp({ books }: WebAppProps) {

    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [showReservations, setShowReservations] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [theme, setTheme] = useState<Theme>('indigo');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const applyTheme = (t: Theme) => {
        setTheme(t);
        const root = document.documentElement;
        Object.entries(THEMES[t]).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    };

    useEffect(() => {
        applyTheme('indigo');
    }, []);

    const addToReservations = (b: Book) => {
        if (b.availableCopies === 0) return;
        setReservations(prev => {
            const existing = prev.find(i => i.id === b.id);
            if (existing) return prev;
            return [...prev, { ...b, qty: 1 }];
        });
    };

    const removeFromReservations = (id: string) => setReservations(prev => prev.filter(i => i.id !== id));
    
    const toggleFav = (id: string) =>
        setFavorites(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

    const reservationCount = reservations.length;

    const visibleBooks = books.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col overflow-x-hidden min-h-full" style={{ background: 'var(--color-brand-background)' }}>

            {/* ── HEADER ────────────────────────────────────────────────────────── */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-4 flex items-center justify-between">

                    {/* Mobile: menu + logo */}
                    <div className="flex items-center gap-3 sm:hidden">
                        <button className="p-1" style={{ color: 'var(--color-brand-text)' }} onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="flex items-center gap-1.5">
                            <div className="p-1 rounded-full text-white" style={{ background: 'var(--color-brand-primary)' }}>
                                <Library size={16} />
                            </div>
                            <span className="text-base font-bold" style={{ color: 'var(--color-brand-secondary)' }}>SGBU</span>
                        </div>
                    </div>

                    {/* Desktop logo */}
                    <div className="hidden sm:flex items-center gap-3 cursor-pointer shrink-0">
                        <div className="p-2 rounded-xl text-white shadow-lg" style={{ background: 'var(--color-brand-primary)' }}>
                            <Library size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tighter" style={{ color: 'var(--color-brand-secondary)' }}>{EMPRESA}</span>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden sm:flex items-center gap-4 lg:gap-8 flex-1 justify-center">
                        <div className="flex items-center gap-6 lg:gap-8 px-6 py-2 bg-gray-50/50 rounded-2xl border border-black/5">
                            <a href="#inicio" className="text-sm font-bold transition-all hover:scale-110" style={{ color: 'var(--color-brand-text)' }}>Inicio</a>
                            <a href="#catalogo" className="text-sm font-bold transition-all hover:scale-110" style={{ color: 'var(--color-brand-text)' }}>Catálogo</a>
                            <button className="text-sm font-bold transition-all hover:scale-110" style={{ color: 'var(--color-brand-text)' }}>Mis Préstamos</button>
                        </div>

                        {/* Theme Switcher */}
                        <div className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-xl border border-black/5">
                            {(['indigo', 'slate', 'contrast'] as Theme[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => applyTheme(t)}
                                    className={`w-6 h-6 rounded-lg border-2 transition-all ${theme === t ? 'scale-110 shadow-md border-white' : 'scale-90 opacity-50 border-transparent hover:opacity-100'}`}
                                    style={{ background: THEMES[t]['--color-brand-primary'] }}
                                    title={`Tema ${t}`}
                                />
                            ))}
                        </div>

                        <div className="relative border-l pl-5 lg:pl-8 border-gray-200">
                            {!isLoggedIn ? (
                                <button
                                    onClick={() => setIsLoggedIn(true)}
                                    className="flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md border bg-white"
                                    style={{ color: 'var(--color-brand-primary)', borderColor: 'var(--color-brand-primary)' }}
                                >
                                    <User size={16} /> <span className="hidden lg:inline">Mi Perfil</span>
                                </button>
                            ) : (
                                <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner" style={{ background: 'var(--color-brand-primary)' }}>VS</div>
                                    <div className="text-left hidden lg:block">
                                        <p className="text-xs font-black text-gray-800 leading-none">Valentina Soto</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </nav>

                    <div className="flex items-center gap-2 shrink-0 ml-4">
                        <button
                            onClick={() => setShowReservations(true)}
                            className="relative p-2.5 rounded-xl text-white font-bold transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
                            style={{ background: 'var(--color-brand-primary)' }}
                        >
                            <Bookmark size={18} />
                            {reservationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {reservationCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="flex flex-col p-4 gap-4">
                            {!isLoggedIn
                                ? <button onClick={() => { setIsLoggedIn(true); setMenuOpen(false); }} className="flex items-center gap-3 p-4 rounded-xl font-bold justify-center text-white" style={{ background: 'var(--color-brand-primary)' }}><User size={20} /> Acceder</button>
                                : <div className="bg-gray-50 p-4 rounded-xl mb-2 flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'var(--color-brand-primary)' }}>VS</div><div><p className="font-bold text-gray-800">Valentina Soto</p><p className="text-xs text-gray-500">v.soto@u.edu</p></div></div>
                            }
                            {['Inicio', 'Catálogo', 'Mis Préstamos'].map(l => (
                                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-lg font-medium" style={{ color: 'var(--color-brand-text)' }}>{l}</a>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* ── HERO ──────────────────────────────────────────────────────────── */}
            <section id="inicio" className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] sm:w-[35vw] sm:h-[35vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" style={{ background: 'var(--color-brand-primary)', opacity: 0.15 }} />
                
                <div className="container mx-auto px-6 sm:px-12 relative z-10">
                    <div className="grid sm:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div className="text-center sm:text-left order-2 sm:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm mb-6 mx-auto sm:mx-0 border border-black/5">
                                <Star className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-brand-secondary)' }}>
                                    Biblioteca Universitaria
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black leading-[1.1] mb-6 tracking-tight" style={{ color: 'var(--color-brand-text)' }}>
                                El Conocimiento<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-slate-500" style={{ backgroundImage: 'linear-gradient(to right, var(--color-brand-primary), var(--color-brand-accent))' }}>a un Clic</span><br />
                                de Distancia
                            </h1>
                            <p className="text-sm lg:text-base text-gray-500 mb-8 max-w-md mx-auto sm:mx-0 leading-relaxed">
                                Explora miles de libros, reserva materiales y gestiona tus préstamos de forma sencilla y rápida.
                            </p>
                            <div className="flex flex-col xs:flex-row gap-3 items-center sm:items-start justify-center sm:justify-start">
                                <div className="relative w-full max-w-md">
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por título, autor o categoría..." 
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="order-1 sm:order-2 w-full flex justify-center items-center">
                            <div className="relative w-full max-w-[320px] lg:max-w-[400px] aspect-square">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-slate-100 rounded-[3rem] rotate-6 opacity-50" />
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[3rem] border border-white/40 shadow-2xl flex items-center justify-center p-8 overflow-hidden">
                                    <BookOpen className="w-32 h-32 lg:w-48 lg:h-48 opacity-10 blur-sm absolute -bottom-10 -right-10 rotate-12" style={{ color: 'var(--color-brand-primary)' }} />
                                    <div className="text-center relative z-10">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-4 animate-bounce">
                                            <Bookmark size={32} />
                                        </div>
                                        <p className="font-black text-2xl lg:text-3xl tracking-tight" style={{ color: 'var(--color-brand-text)' }}>Tu Portal al <br />Conocimiento</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CATALOG GRID ──────────────────────────────────────────────────── */}
            <main id="catalogo" className="container mx-auto px-4 py-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold" style={{ color: 'var(--color-brand-text)' }}>
                            Catálogo de <span style={{ color: 'var(--color-brand-primary)' }}>Libros</span>
                        </h2>
                        <p className="text-gray-600">Encuentra los materiales que necesitas para tus estudios</p>
                    </div>
                    <div className="flex gap-2">
                         <span className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-600">Total: {visibleBooks.length} libros</span>
                    </div>
                </div>

                {visibleBooks.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <Package size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No se encontraron libros que coincidan con tu búsqueda</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                        {visibleBooks.map(b => (
                            <div key={b.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <button
                                        onClick={() => toggleFav(b.id)}
                                        className={`absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full transition-colors z-10 shadow-sm ${favorites.has(b.id) ? '' : 'text-gray-500 hover:text-brand'}`}
                                        style={{ color: favorites.has(b.id) ? 'var(--color-brand-primary)' : '' }}
                                    >
                                        <Heart size={16} className={favorites.has(b.id) ? 'fill-current' : ''} />
                                    </button>
                                </div>
                                <div className="p-3 md:p-4 flex flex-col flex-grow">
                                    <div className="mb-3 flex-grow">
                                        <span className="text-[10px] font-medium uppercase tracking-wider block mb-1" style={{ color: 'var(--color-brand-secondary)' }}>{b.category}</span>
                                        <h3 className="text-sm md:text-base font-bold mb-1 leading-tight line-clamp-2" style={{ color: 'var(--color-brand-text)' }}>{b.title}</h3>
                                        <p className="text-indigo-600 text-xs font-semibold mb-2">{b.author}</p>
                                        <p className="text-gray-500 text-[10px] md:text-sm line-clamp-3 leading-relaxed">{b.description}</p>
                                    </div>
                                    <div className="mt-auto pt-3 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                                b.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 
                                                b.status === 'low_stock' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {b.status === 'available' ? 'Disponible' : b.status === 'low_stock' ? 'Últimas copias' : 'Prestado'}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-medium">{b.availableCopies} de {b.totalStock} copias</span>
                                        </div>
                                        <button
                                            onClick={() => addToReservations(b)}
                                            disabled={b.availableCopies === 0}
                                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm"
                                            style={{ background: 'var(--color-brand-primary)' }}
                                        >
                                            <Bookmark size={14} />
                                            Reservar Libro
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ── FOOTER ────────────────────────────────────────────────────────── */}
            <footer id="footer" className="w-full mt-auto">
                <div className="bg-white py-12 border-t border-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Clock, title: 'Atención', sub: 'L-V: 08:00 - 20:00' },
                                { icon: History, title: 'Préstamos', sub: 'Hasta 15 días' },
                                { icon: ShieldCheck, title: 'Seguridad', sub: 'Acceso por ID' },
                                { icon: Package, title: 'Materiales', sub: 'Digital & Físico' },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div key={title} className="flex flex-col items-center text-center group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-500 border border-black/5" style={{ color: 'var(--color-brand-primary)' }}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm">{title}</h3>
                                    <p className="text-[10px] sm:text-xs text-gray-400">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 text-white" style={{ background: '#0f172a' }}>
                    <div className="container mx-auto px-8 sm:px-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                            {[
                                { title: 'Servicios', links: ['Búsqueda Avanzada', 'Préstamos', 'Reservas', 'Tesis'] },
                                { title: 'Recursos', links: ['Base de Datos', 'Revistas', 'E-books'] },
                                { title: 'Ayuda', links: ['Guía de Usuario', 'Contacto', 'Ubicación'] },
                                { title: 'Legal', links: ['Reglamento', 'Privacidad'] },
                            ].map(({ title, links }) => (
                                <div key={title}>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 opacity-30">{title}</h4>
                                    <ul className="space-y-3 text-gray-400 text-xs">
                                        {links.map(l => <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-right text-gray-600 text-xs w-full">
                                <p>© 2026 {EMPRESA} | Universidad Digital</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ── RESERVATIONS MODAL ────────────────────────────────────────────────────── */}
            {showReservations && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowReservations(false)} />
                    <div className="relative bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl text-white" style={{ background: 'var(--color-brand-primary)' }}>
                                    <Bookmark size={20} />
                                </div>
                                <h2 className="text-xl font-bold" style={{ color: 'var(--color-brand-text)' }}>
                                    Mis Reservas <span className="text-sm font-normal text-gray-500 ml-1">({reservationCount})</span>
                                </h2>
                            </div>
                            <button onClick={() => setShowReservations(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={20} style={{ color: 'var(--color-brand-text)' }} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {reservations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                                    <Bookmark size={56} className="opacity-20" />
                                    <p className="text-lg font-medium">No tienes reservas activas</p>
                                    <button onClick={() => setShowReservations(false)} className="text-sm font-bold px-6 py-2.5 rounded-full text-white" style={{ background: 'var(--color-brand-primary)' }}>
                                        Ir al Catálogo
                                    </button>
                                </div>
                            ) : (
                                reservations.map(item => (
                                    <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-2xl">
                                        <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-xl flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm leading-tight mb-1 truncate" style={{ color: 'var(--color-brand-text)' }}>{item.title}</p>
                                            <p className="text-xs text-indigo-600 mb-2">{item.author}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">Pendiente de retiro</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button onClick={() => removeFromReservations(item.id)} className="p-1 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {reservations.length > 0 && (
                            <div className="border-t border-gray-100 p-4 space-y-3">
                                <p className="text-xs text-gray-500 text-center">Debes retirar estos materiales en un plazo máximo de 48 horas.</p>
                                <button onClick={() => setShowReservations(false)} className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ background: 'var(--color-brand-primary)' }}>
                                    Confirmar Reservas <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
