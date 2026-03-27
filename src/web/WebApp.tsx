import { useState, useEffect } from 'react';
import {
    Library, BookOpen, Heart, Star, Search, Menu, X, User, Bookmark,
    ChevronRight, Trash2, Clock, History, ShieldCheck, Package,
    GraduationCap, Calendar, Database, Globe, Monitor, MapPin,
    Users, Sparkles, ArrowRight, BookMarked, FlaskConical, Building2
} from 'lucide-react';
import type { Book } from '../shared/types';
import { MOCK_STUDY_ROOMS, MOCK_EVENTS, MOCK_DIGITAL_RESOURCES } from '../shared/mockData';

interface ReservationItem extends Book { qty: number; }

interface WebAppProps {
    books: Book[];
}

const EMPRESA = 'SGBU';
const FACULTIES = ['Todas', 'Ingeniería', 'Medicina', 'Ciencias', 'Derecho', 'Humanidades', 'Economía'];

export function WebApp({ books }: WebAppProps) {
    const [reservations, setReservations] = useState<ReservationItem[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [showReservations, setShowReservations] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('Todas');

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
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

    const visibleBooks = books.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFaculty = selectedFaculty === 'Todas' || b.faculty === selectedFaculty;
        return matchesSearch && matchesFaculty;
    });

    const eventTypeColors: Record<string, string> = {
        workshop: 'bg-blue-100 text-blue-700',
        seminar: 'bg-purple-100 text-purple-700',
        expo: 'bg-amber-100 text-amber-700',
        conference: 'bg-emerald-100 text-emerald-700',
    };
    const eventTypeLabels: Record<string, string> = {
        workshop: 'Taller', seminar: 'Seminario', expo: 'Exposición', conference: 'Conferencia'
    };

    return (
        <div className="flex flex-col overflow-x-hidden min-h-full" style={{ background: '#f5f7fa' }}>

            {/* HEADER */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-indigo-900/5 py-2' : 'bg-transparent py-4'}`}>
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:hidden">
                        <button className="p-1.5 text-slate-700" onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-xl text-white bg-gradient-to-br from-[#1a237e] to-[#0d47a1] shadow-lg">
                                <Library size={16} />
                            </div>
                            <span className="text-sm font-black text-[#0d1b4a]">{EMPRESA}</span>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 cursor-pointer shrink-0">
                        <div className="p-2.5 rounded-xl text-white bg-gradient-to-br from-[#1a237e] to-[#0d47a1] shadow-xl shadow-indigo-500/20">
                            <Library size={22} />
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-tight text-[#0d1b4a] block leading-none">{EMPRESA}</span>
                            <span className="text-[9px] font-bold text-[#c9a84c] uppercase tracking-[0.2em]">Biblioteca Universitaria</span>
                        </div>
                    </div>

                    <nav className="hidden sm:flex items-center gap-3 lg:gap-6 flex-1 justify-center">
                        <div className="flex items-center gap-4 lg:gap-6 px-5 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/50">
                            {[['#inicio', 'Inicio'], ['#catalogo', 'Catálogo'], ['#servicios', 'Servicios'], ['#salas', 'Salas'], ['#eventos', 'Eventos']].map(([href, label]) => (
                                <a key={label} href={href} className="text-xs font-bold text-slate-600 hover:text-[#1a237e] transition-all hover:scale-105">{label}</a>
                            ))}
                        </div>
                    </nav>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:block">
                            {!isLoggedIn ? (
                                <button onClick={() => setIsLoggedIn(true)} className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-[#1a237e] text-white hover:bg-[#0d1b4a] transition-all shadow-lg shadow-indigo-900/20">
                                    <GraduationCap size={16} /> Portal Estudiante
                                </button>
                            ) : (
                                <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-[#1a237e] to-[#c9a84c]">VS</div>
                                    <span className="text-xs font-bold text-slate-800 hidden lg:inline">Valentina S.</span>
                                </button>
                            )}
                        </div>
                        <button onClick={() => setShowReservations(true)} className="relative p-2.5 rounded-xl text-white font-bold transition-all hover:scale-105 shadow-lg bg-gradient-to-br from-[#1a237e] to-[#283593]">
                            <Bookmark size={18} />
                            {reservationCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#c9a84c] text-[#0d1b4a] text-[9px] font-black rounded-full flex items-center justify-center shadow-md">{reservationCount}</span>
                            )}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-xl">
                        <div className="flex flex-col p-4 gap-3">
                            {!isLoggedIn
                                ? <button onClick={() => { setIsLoggedIn(true); setMenuOpen(false); }} className="flex items-center gap-3 p-4 rounded-2xl font-bold justify-center text-white bg-gradient-to-r from-[#1a237e] to-[#0d47a1]"><GraduationCap size={20} /> Acceder</button>
                                : <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br from-[#1a237e] to-[#c9a84c]">VS</div><div><p className="font-bold text-slate-800">Valentina Soto</p><p className="text-xs text-slate-500">v.soto@u.edu</p></div></div>
                            }
                            {['Inicio', 'Catálogo', 'Servicios', 'Salas', 'Eventos'].map(l => (
                                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="text-base font-medium text-slate-700 px-2 py-2">{l}</a>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* HERO */}
            <section id="inicio" className="relative pt-20 pb-12 sm:pt-28 sm:pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b4a] via-[#1a237e] to-[#283593]" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(201,168,76,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0,121,107,0.3) 0%, transparent 50%)' }} />
                <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#c9a84c]/10 blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#00796b]/10 blur-[100px]" />

                <div className="container mx-auto px-6 sm:px-12 relative z-10">
                    <div className="grid sm:grid-cols-2 gap-8 lg:gap-16 items-center">
                        <div className="text-center sm:text-left order-2 sm:order-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 mx-auto sm:mx-0 border border-white/10">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#c9a84c]">Biblioteca Abierta · L-V 08:00 - 21:00</span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black leading-[1.05] mb-6 tracking-tight text-white">
                                Tu Biblioteca<br />
                                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #c9a84c, #e6c970, #c9a84c)' }}>Universitaria</span><br />
                                Digital
                            </h1>
                            <p className="text-sm lg:text-base text-blue-200/80 mb-8 max-w-md mx-auto sm:mx-0 leading-relaxed">
                                Accede a miles de recursos académicos, reserva salas de estudio, y gestiona tus préstamos desde cualquier dispositivo.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-2 justify-center sm:justify-start">
                                <a href="#catalogo" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c9a84c] text-[#0d1b4a] font-bold text-sm hover:bg-[#d4b85a] transition-all shadow-lg shadow-[#c9a84c]/20">
                                    <Search size={16} /> Explorar Catálogo
                                </a>
                                <a href="#salas" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all">
                                    <MapPin size={16} /> Reservar Sala
                                </a>
                            </div>
                        </div>

                        <div className="order-1 sm:order-2 w-full flex justify-center items-center">
                            <div className="relative w-full max-w-[340px] lg:max-w-[420px]">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { icon: BookOpen, label: 'Libros', val: '12,450', color: 'from-[#1a237e] to-[#283593]' },
                                        { icon: Users, label: 'Estudiantes', val: '3,200+', color: 'from-[#00796b] to-[#00897b]' },
                                        { icon: Database, label: 'Digital', val: '8 Bases', color: 'from-[#b8860b] to-[#c9a84c]' },
                                    ].map(({ icon: Icon, label, val, color }, i) => (
                                        <div key={label} className={`p-4 lg:p-5 rounded-2xl bg-gradient-to-br ${color} shadow-2xl border border-white/10 text-white animate-fade-in-up`} style={{ animationDelay: `${i * 0.15}s` }}>
                                            <Icon size={24} className="mb-3 opacity-80" />
                                            <p className="text-lg lg:text-xl font-black leading-none">{val}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-wider mt-1 opacity-60">{label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/20 flex items-center justify-center"><GraduationCap size={20} className="text-[#c9a84c]" /></div>
                                        <div>
                                            <p className="text-xs font-bold">Próximo Evento</p>
                                            <p className="text-[10px] text-blue-200/60">{MOCK_EVENTS[0]?.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f5f7fa] to-transparent" />
            </section>

            {/* SERVICIOS ACADEMICOS */}
            <section id="servicios" className="container mx-auto px-4 py-12 sm:py-16">
                <div className="text-center mb-10">
                    <span className="text-[10px] font-black text-[#c9a84c] uppercase tracking-[0.3em]">Recursos Digitales</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0d1b4a] mt-2">Servicios Académicos</h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">Accede a bases de datos, repositorios y recursos digitales desde cualquier lugar.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {MOCK_DIGITAL_RESOURCES.map((res, i) => (
                        <div key={res.id} className="group bg-white rounded-2xl p-5 lg:p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="text-3xl mb-4">{res.icon}</div>
                            <h3 className="font-bold text-sm text-[#0d1b4a] mb-1.5 group-hover:text-[#1a237e] transition-colors">{res.name}</h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{res.description}</p>
                            <div className="flex items-center justify-between mt-4">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${res.accessLevel === 'open' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {res.accessLevel === 'open' ? 'Acceso Libre' : 'Institucional'}
                                </span>
                                <ArrowRight size={14} className="text-slate-300 group-hover:text-[#1a237e] group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SALAS DE ESTUDIO */}
            <section id="salas" className="py-12 sm:py-16" style={{ background: 'linear-gradient(135deg, #0d1b4a 0%, #1a237e 100%)' }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <span className="text-[10px] font-black text-[#c9a84c] uppercase tracking-[0.3em]">Reserva tu Espacio</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Salas de Estudio</h2>
                        <p className="text-sm text-blue-200/60 mt-2">Disponibilidad en tiempo real</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {MOCK_STUDY_ROOMS.map(room => (
                            <div key={room.id} className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">{room.name}</h3>
                                        <p className="text-[10px] text-blue-200/50 font-bold uppercase tracking-wider mt-0.5">Piso {room.floor} · {room.capacity} pers.</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`w-3 h-3 rounded-full ${room.available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        {room.available && <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-50" />}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {room.equipment.map(eq => (
                                        <span key={eq} className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-blue-200/70 font-bold">{eq}</span>
                                    ))}
                                </div>
                                {room.available ? (
                                    <button className="w-full py-2.5 rounded-xl bg-[#c9a84c] text-[#0d1b4a] font-bold text-xs hover:bg-[#d4b85a] transition-all shadow-lg shadow-[#c9a84c]/20">
                                        Reservar Sala
                                    </button>
                                ) : (
                                    <div className="text-center py-2">
                                        <p className="text-[10px] text-red-300 font-bold">{room.currentUser}</p>
                                        <p className="text-[9px] text-blue-200/40 mt-0.5">Disponible a las {room.nextAvailable}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CATALOGO */}
            <main id="catalogo" className="container mx-auto px-4 py-12 sm:py-16">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-black text-[#c9a84c] uppercase tracking-[0.3em]">Explora</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#0d1b4a] mt-1">Catálogo Bibliográfico</h2>
                    </div>
                    <span className="px-4 py-2 bg-[#1a237e]/5 rounded-xl text-xs font-bold text-[#1a237e]">{visibleBooks.length} recursos encontrados</span>
                </div>

                {/* Search Bar */}
                <div className="relative w-full max-w-2xl mb-6">
                    <input
                        type="text"
                        placeholder="Buscar libros, autores, tesis..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-[#1a237e] focus:ring-2 focus:ring-[#1a237e]/10 outline-none transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>

                {/* Faculty Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                    {FACULTIES.map(f => (
                        <button
                            key={f}
                            onClick={() => setSelectedFaculty(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedFaculty === f
                                ? 'bg-[#1a237e] text-white shadow-lg shadow-indigo-900/20'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1a237e]/30'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {visibleBooks.length === 0 ? (
                    <div className="py-20 text-center text-slate-400">
                        <Package size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-medium">No se encontraron libros con esos filtros</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                        {visibleBooks.map(b => (
                            <div key={b.id} className="bg-white rounded-2xl shadow-md overflow-hidden group flex flex-col h-full hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border border-slate-100">
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        onClick={() => toggleFav(b.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full transition-all z-10 shadow-sm hover:scale-110"
                                    >
                                        <Heart size={16} className={favorites.has(b.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                                    </button>
                                    {b.isFeatured && (
                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#c9a84c] text-[#0d1b4a] text-[8px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <Sparkles size={8} /> Destacado
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 md:p-4 flex flex-col flex-grow">
                                    <div className="mb-3 flex-grow">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#c9a84c] block mb-1">{b.category}{b.faculty ? ` · ${b.faculty}` : ''}</span>
                                        <h3 className="text-sm md:text-base font-bold mb-1 leading-tight line-clamp-2 text-[#0d1b4a]">{b.title}</h3>
                                        <p className="text-[#1a237e] text-xs font-semibold mb-2">{b.author}</p>
                                        <p className="text-slate-500 text-[10px] md:text-xs line-clamp-2 leading-relaxed">{b.description}</p>
                                    </div>
                                    <div className="mt-auto pt-3 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${b.status === 'available' ? 'bg-emerald-50 text-emerald-700' :
                                                b.status === 'low_stock' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                                {b.status === 'available' ? 'Disponible' : b.status === 'low_stock' ? 'Últimas copias' : 'Prestado'}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-medium">{b.availableCopies}/{b.totalStock}</span>
                                        </div>
                                        <button
                                            onClick={() => addToReservations(b)}
                                            disabled={b.availableCopies === 0}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-xs bg-gradient-to-r from-[#1a237e] to-[#283593] shadow-md shadow-indigo-900/10"
                                        >
                                            <BookMarked size={14} /> Reservar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* EVENTOS */}
            <section id="eventos" className="container mx-auto px-4 py-12 sm:py-16">
                <div className="text-center mb-10">
                    <span className="text-[10px] font-black text-[#c9a84c] uppercase tracking-[0.3em]">Próximamente</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0d1b4a] mt-2">Eventos Académicos</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_EVENTS.map(ev => (
                        <div key={ev.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${eventTypeColors[ev.type]}`}>
                                    {eventTypeLabels[ev.type]}
                                </span>
                                <Calendar size={14} className="text-slate-300" />
                            </div>
                            <h3 className="font-bold text-sm text-[#0d1b4a] mb-2 leading-tight line-clamp-2">{ev.title}</h3>
                            <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-3">{ev.description}</p>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    <Calendar size={10} /><span className="font-bold">{ev.date} · {ev.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    <MapPin size={10} /><span>{ev.location}</span>
                                </div>
                                {ev.speaker && (
                                    <div className="flex items-center gap-2 text-[10px] text-[#1a237e]">
                                        <User size={10} /><span className="font-bold">{ev.speaker}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="w-full mt-auto">
                <div className="bg-white py-10 border-t border-slate-100">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Clock, title: 'Horario', sub: 'L-V: 08:00 - 21:00\nSáb: 09:00 - 14:00' },
                                { icon: History, title: 'Préstamos', sub: 'Hasta 15 días\nRenovación online' },
                                { icon: ShieldCheck, title: 'Acceso', sub: 'Credencial universitaria\no código QR' },
                                { icon: Monitor, title: 'Multiplataforma', sub: 'Web, Móvil y Desktop\nSincronización auto.' },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div key={title} className="flex flex-col items-center text-center group">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1a237e]/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-[#1a237e] border border-[#1a237e]/10">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1 text-sm">{title}</h3>
                                    <p className="text-[10px] text-slate-400 whitespace-pre-line leading-relaxed">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-12 pb-8 text-white" style={{ background: 'linear-gradient(135deg, #0d1b4a 0%, #1a237e 100%)' }}>
                    <div className="container mx-auto px-8 sm:px-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                            {[
                                { title: 'Servicios', links: ['Catálogo Online', 'Préstamos', 'Reservas', 'Tesis y Memorias'] },
                                { title: 'Recursos', links: ['Bases de Datos', 'Revistas Científicas', 'E-books', 'Repositorio'] },
                                { title: 'Comunidad', links: ['Eventos', 'Talleres', 'Salas de Estudio', 'Bibliografías'] },
                                { title: 'Información', links: ['Reglamento', 'Horarios', 'Contacto', 'Ubicación'] },
                            ].map(({ title, links }) => (
                                <div key={title}>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-5 text-[#c9a84c]">{title}</h4>
                                    <ul className="space-y-2.5 text-blue-200/60 text-xs">
                                        {links.map(l => <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/10"><Library size={18} /></div>
                                <div>
                                    <p className="font-black text-sm">{EMPRESA}</p>
                                    <p className="text-[9px] text-[#c9a84c] font-bold uppercase tracking-widest">Biblioteca Universitaria</p>
                                </div>
                            </div>
                            <p className="text-blue-200/40 text-xs">© 2026 Sistema de Gestión Bibliotecaria Universitaria</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* RESERVATIONS MODAL */}
            {showReservations && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowReservations(false)} />
                    <div className="relative bg-white h-full w-full max-w-md shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl text-white bg-gradient-to-br from-[#1a237e] to-[#283593]"><Bookmark size={20} /></div>
                                <h2 className="text-lg font-black text-[#0d1b4a]">
                                    Mis Reservas <span className="text-sm font-normal text-slate-400 ml-1">({reservationCount})</span>
                                </h2>
                            </div>
                            <button onClick={() => setShowReservations(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} className="text-slate-500" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {reservations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                                    <BookMarked size={56} className="opacity-20" />
                                    <p className="text-lg font-medium">Aún no has reservado</p>
                                    <button onClick={() => setShowReservations(false)} className="text-sm font-bold px-6 py-2.5 rounded-full text-white bg-gradient-to-r from-[#1a237e] to-[#283593]">
                                        Explorar Catálogo
                                    </button>
                                </div>
                            ) : (
                                reservations.map(item => (
                                    <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl">
                                        <img src={item.image} alt={item.title} className="w-14 h-20 object-cover rounded-xl flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm leading-tight mb-1 truncate text-[#0d1b4a]">{item.title}</p>
                                            <p className="text-xs text-[#1a237e] mb-1">{item.author}</p>
                                            <span className="text-[9px] bg-[#1a237e]/10 text-[#1a237e] font-bold px-2 py-0.5 rounded">Pendiente de retiro</span>
                                        </div>
                                        <button onClick={() => removeFromReservations(item.id)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-red-500 transition-colors self-start"><Trash2 size={14} /></button>
                                    </div>
                                ))
                            )}
                        </div>

                        {reservations.length > 0 && (
                            <div className="border-t border-slate-100 p-4 space-y-3">
                                <p className="text-xs text-slate-500 text-center">Retira en la biblioteca dentro de 48 horas.</p>
                                <button onClick={() => setShowReservations(false)} className="w-full py-3.5 rounded-2xl font-bold text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a237e] to-[#283593] shadow-lg shadow-indigo-900/20">
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
