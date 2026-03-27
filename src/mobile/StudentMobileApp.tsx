import { useState } from 'react';
import {
    Home, Library, BookOpen, User, Search, Clock,
    Bookmark, Heart, ChevronRight, Calendar, MapPin,
    Bell, Sparkles, BookMarked, GraduationCap, History,
    AlertCircle, CheckCircle, Users, Plus, Settings,
    PlusCircle, MinusCircle, Edit, X, Wallet, CreditCard,
    ArrowUpRight, Filter, Phone, Mail, ShieldCheck,
    BarChart3, Check
} from 'lucide-react';
import type { Book, Loan } from '../shared/types';
import { MOCK_LOANS, MOCK_USERS, MOCK_STUDY_ROOMS, MOCK_EVENTS } from '../shared/mockData';

type Role = 'student' | 'librarian';
type StudentView = 'home' | 'catalog' | 'loans' | 'rooms' | 'profile';
type LibrarianView = 'loans' | 'catalog' | 'users' | 'fines' | 'reports';

interface StudentMobileAppProps { books: Book[]; }

const STUDENT_USER = { name: 'Valentina Soto', email: 'v.soto@u.edu', faculty: 'Ing. Civil Informática', semester: 5, initials: 'VS' };
const LIBRARIAN_USER = { name: 'Carlos Ruiz', email: 'c.ruiz@u.edu', role: 'Bibliotecario Senior', initials: 'CR' };

/* ═══════════════════════════════════════════════
   ROLE SELECTOR SCREEN
   ═══════════════════════════════════════════════ */
function RoleSelector({ onSelect }: { onSelect: (r: Role) => void }) {
    return (
        <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#0d1b4a] via-[#1a237e] to-[#283593] items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#c9a84c]/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#00796b]/10 blur-[80px]" />
            <div className="relative z-10 text-center w-full max-w-xs">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-white/10">
                    <Library size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-black text-white">SGBU</h1>
                <p className="text-[9px] font-bold text-[#c9a84c] uppercase tracking-[0.3em] mt-1">Biblioteca Universitaria</p>
                <p className="text-xs text-blue-200/50 mt-4 mb-8">Selecciona tu perfil para continuar</p>

                <div className="space-y-3">
                    <button onClick={() => onSelect('student')} className="w-full bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all text-left group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#b8860b] flex items-center justify-center text-[#0d1b4a] shrink-0">
                            <GraduationCap size={22} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">Estudiante</p>
                            <p className="text-[10px] text-blue-200/50 mt-0.5">Catálogo, préstamos, salas</p>
                        </div>
                        <ChevronRight size={16} className="text-white/30 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button onClick={() => onSelect('librarian')} className="w-full bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all text-left group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a237e] to-[#0d47a1] flex items-center justify-center text-white shrink-0 border border-white/20">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-white">Bibliotecario</p>
                            <p className="text-[10px] text-blue-200/50 mt-0.5">Gestión, usuarios, multas</p>
                        </div>
                        <ChevronRight size={16} className="text-white/30 ml-auto group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   STUDENT VIEWS
   ═══════════════════════════════════════════════ */
function StudentBottomNav({ view, onView }: { view: StudentView; onView: (v: StudentView) => void }) {
    const items = [
        { id: 'home' as StudentView, icon: Home, label: 'Inicio' },
        { id: 'catalog' as StudentView, icon: Library, label: 'Catálogo' },
        { id: 'loans' as StudentView, icon: BookOpen, label: 'Préstamos' },
        { id: 'rooms' as StudentView, icon: MapPin, label: 'Salas' },
        { id: 'profile' as StudentView, icon: User, label: 'Perfil' },
    ];
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t shadow-xl" style={{ borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.25rem)' }}>
            <div className="px-1 pt-1.5 pb-0.5">
                <div className="grid grid-cols-5 gap-0.5">
                    {items.map(({ id, icon: Icon, label }) => (
                        <button key={id} onClick={() => onView(id)} className={`flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg transition-all ${view === id ? 'text-[#1a237e]' : 'text-gray-400'}`}>
                            <Icon className={`w-4 h-4 ${view === id ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-[8px] font-bold uppercase tracking-tighter">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StudentHomeView({ books, onNav }: { books: Book[]; onNav: (v: StudentView) => void }) {
    const userLoans = MOCK_LOANS.filter(l => l.userId === 'u1' && l.status !== 'returned');
    const overdueCount = userLoans.filter(l => l.status === 'overdue').length;
    const featured = books.filter(b => b.isFeatured).slice(0, 4);
    const nextEvent = MOCK_EVENTS[0];

    return (
        <div className="min-h-full pb-20">
            <div className="bg-gradient-to-br from-[#0d1b4a] via-[#1a237e] to-[#283593] px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#c9a84c]/10 blur-[50px]" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div><p className="text-blue-200/50 text-[10px] font-bold">Buenos días 👋</p><h1 className="text-lg font-black text-white mt-0.5">{STUDENT_USER.name}</h1></div>
                        <div className="flex items-center gap-2">
                            <button className="relative p-1.5 rounded-lg bg-white/10 text-white/80"><Bell size={16} />{overdueCount > 0 && <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />}</button>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#b8860b] flex items-center justify-center text-[#0d1b4a] font-black text-[10px]">{STUDENT_USER.initials}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[{ label: 'Activos', val: userLoans.length, icon: BookOpen, c: 'bg-blue-500/20 text-blue-300' }, { label: 'Favoritos', val: '8', icon: Heart, c: 'bg-pink-500/20 text-pink-300' }, { label: 'Reservas', val: '2', icon: Bookmark, c: 'bg-amber-500/20 text-amber-300' }].map(({ label, val, icon: Icon, c }) => (
                            <div key={label} className="bg-white/5 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center mb-1 ${c}`}><Icon size={12} /></div>
                                <p className="text-base font-black text-white leading-none">{val}</p>
                                <p className="text-[7px] font-bold text-blue-200/40 uppercase tracking-widest mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="px-4 -mt-3 relative z-20 space-y-4">
                {overdueCount > 0 && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
                        <AlertCircle size={18} className="text-red-500 shrink-0" />
                        <div className="flex-1"><p className="text-[10px] font-bold text-red-800">{overdueCount} préstamo(s) vencido(s)</p></div>
                    </div>
                )}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input type="text" placeholder="Buscar libros..." className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-400" />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[11px] font-black text-[#0d1b4a] uppercase tracking-wider">Préstamos Activos</h3>
                        <button onClick={() => onNav('loans')} className="text-[9px] font-bold text-[#1a237e] flex items-center gap-0.5">Ver todos <ChevronRight size={10} /></button>
                    </div>
                    {userLoans.length === 0 ? (
                        <div className="bg-white rounded-xl p-5 text-center border border-slate-100"><BookOpen size={28} className="mx-auto mb-1 text-slate-300" /><p className="text-[10px] text-slate-400">Sin préstamos activos</p></div>
                    ) : (
                        <div className="space-y-2">{userLoans.slice(0, 2).map(loan => (
                            <div key={loan.id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${loan.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-[#1a237e]/5 text-[#1a237e]'}`}><BookOpen size={16} /></div>
                                <div className="flex-1 min-w-0"><p className="text-[11px] font-bold text-slate-800 truncate">{loan.bookTitle}</p><p className="text-[9px] text-slate-400 mt-0.5">Vence: {loan.dueDate.toLocaleDateString()}</p></div>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${loan.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{loan.status === 'overdue' ? 'Vencido' : 'Activo'}</span>
                            </div>
                        ))}</div>
                    )}
                </div>
                <div>
                    <h3 className="text-[11px] font-black text-[#0d1b4a] uppercase tracking-wider mb-2">Destacados</h3>
                    <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
                        {featured.map(book => (
                            <div key={book.id} className="min-w-[110px] bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                <div className="aspect-[3/4] overflow-hidden relative"><img src={book.image} alt={book.title} className="w-full h-full object-cover" /></div>
                                <div className="p-2"><p className="text-[9px] font-bold text-slate-800 truncate">{book.title}</p><p className="text-[8px] text-[#1a237e] truncate">{book.author}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
                {nextEvent && (
                    <div className="bg-gradient-to-br from-[#0d1b4a] to-[#1a237e] rounded-xl p-4 text-white relative overflow-hidden">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#c9a84c]">Próximo Evento</span>
                        <h3 className="text-sm font-black mt-1 leading-tight">{nextEvent.title}</h3>
                        <div className="flex items-center gap-3 mt-2 text-[9px] text-blue-200/60">
                            <span className="flex items-center gap-1"><Calendar size={9} />{nextEvent.date}</span>
                            <span className="flex items-center gap-1"><Clock size={9} />{nextEvent.time}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StudentCatalogView({ books }: { books: Book[] }) {
    const [search, setSearch] = useState('');
    const [cat, setCat] = useState('Todos');
    const cats = ['Todos', ...new Set(books.map(b => b.category))];
    const filtered = books.filter(b => { const s = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()); const c = cat === 'Todos' || b.category === cat; return s && c; });
    return (
        <div className="min-h-full pb-20">
            <div className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-20 px-4 py-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <h1 className="text-base font-black text-[#0d1b4a] mb-2">Catálogo</h1>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Search className="w-3.5 h-3.5 text-slate-400" /><input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-[11px] outline-none" />
                </div>
            </div>
            <div className="flex gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide">{cats.map(c => <button key={c} onClick={() => setCat(c)} className={`px-2.5 py-1 rounded-full text-[9px] font-bold whitespace-nowrap ${cat === c ? 'bg-[#1a237e] text-white' : 'bg-slate-100 text-slate-600'}`}>{c}</button>)}</div>
            <div className="px-4 space-y-2">{filtered.map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-slate-50 shadow-sm p-2.5 flex gap-2.5">
                    <img src={b.image} alt={b.title} className="w-12 h-16 rounded-lg object-cover shadow-sm shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div><p className="text-[11px] font-bold text-slate-800 truncate">{b.title}</p><p className="text-[9px] text-[#1a237e]">{b.author}</p></div>
                        <div className="flex items-center justify-between mt-1.5">
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${b.status === 'available' ? 'bg-emerald-50 text-emerald-700' : b.status === 'low_stock' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{b.status === 'available' ? 'Disponible' : b.status === 'low_stock' ? 'Pocas' : 'Agotado'}</span>
                            <button disabled={b.availableCopies === 0} className="px-2.5 py-1 rounded-md text-[8px] font-bold text-white bg-[#1a237e] disabled:opacity-40">Reservar</button>
                        </div>
                    </div>
                </div>
            ))}</div>
        </div>
    );
}

function StudentLoansView() {
    const [tab, setTab] = useState<'active' | 'history'>('active');
    const userLoans = MOCK_LOANS.filter(l => l.userId === 'u1');
    const active = userLoans.filter(l => l.status === 'active' || l.status === 'overdue');
    const hist = userLoans.filter(l => l.status === 'returned');
    const shown = tab === 'active' ? active : hist;
    return (
        <div className="min-h-full pb-20">
            <div className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-20 px-4 py-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <h1 className="text-base font-black text-[#0d1b4a] mb-2">Mis Préstamos</h1>
                <div className="flex gap-1.5 p-0.5 rounded-full bg-slate-100 border border-slate-200">
                    {([['active', `Activos (${active.length})`], ['history', 'Historial']] as ['active' | 'history', string][]).map(([id, label]) => (
                        <button key={id} onClick={() => setTab(id)} className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all ${tab === id ? 'bg-white text-[#1a237e] shadow-sm' : 'text-slate-500'}`}>{label}</button>
                    ))}
                </div>
            </div>
            <div className="px-4 py-3 space-y-2.5">
                {shown.length === 0 ? <div className="py-12 text-center text-slate-400"><History className="w-12 h-12 mb-2 mx-auto opacity-10" /><p className="text-[11px]">Sin registros</p></div> :
                shown.map(loan => (
                    <div key={loan.id} className="bg-white rounded-xl border border-slate-50 shadow-sm p-3">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loan.status === 'overdue' ? 'bg-red-50 text-red-500' : loan.status === 'returned' ? 'bg-emerald-50 text-emerald-500' : 'bg-[#1a237e]/5 text-[#1a237e]'}`}>{loan.status === 'returned' ? <CheckCircle size={14} /> : <BookOpen size={14} />}</div>
                                <div className="min-w-0"><p className="text-[11px] font-bold text-slate-800 truncate">{loan.bookTitle}</p><p className="text-[8px] text-slate-400 mt-0.5">ID: {loan.id}</p></div>
                            </div>
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${loan.status === 'overdue' ? 'bg-red-100 text-red-700' : loan.status === 'returned' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{loan.status === 'overdue' ? 'Vencido' : loan.status === 'returned' ? 'Devuelto' : 'Activo'}</span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100 text-[9px] text-slate-500">
                            <span>Desde: {loan.startDate.toLocaleDateString()}</span><span>Vence: {loan.dueDate.toLocaleDateString()}</span>
                        </div>
                        {loan.penalty && <div className="mt-2 flex items-center justify-between bg-red-50 rounded-lg p-2 border border-red-100"><span className="text-[9px] font-bold text-red-700">Multa</span><span className="text-[11px] font-black text-red-700">${loan.penalty.toLocaleString('es-CL')}</span></div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StudentRoomsView() {
    return (
        <div className="min-h-full pb-20">
            <div className="bg-white/80 backdrop-blur-xl border-b sticky top-0 z-20 px-4 py-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <h1 className="text-base font-black text-[#0d1b4a]">Salas de Estudio</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Disponibilidad en tiempo real</p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100"><p className="text-lg font-black text-emerald-700">{MOCK_STUDY_ROOMS.filter(r => r.available).length}</p><p className="text-[8px] font-bold text-emerald-600 uppercase">Libres</p></div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100"><p className="text-lg font-black text-slate-700">{MOCK_STUDY_ROOMS.length}</p><p className="text-[8px] font-bold text-slate-400 uppercase">Total</p></div>
                </div>
                {MOCK_STUDY_ROOMS.map(room => (
                    <div key={room.id} className="bg-white rounded-xl border border-slate-50 shadow-sm p-3">
                        <div className="flex items-start justify-between mb-2">
                            <div><h3 className="font-bold text-[11px] text-slate-800">{room.name}</h3><p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Piso {room.floor} · {room.capacity} pers.</p></div>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase ${room.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}><div className={`w-1.5 h-1.5 rounded-full ${room.available ? 'bg-emerald-500' : 'bg-red-500'}`} />{room.available ? 'Libre' : 'Ocupada'}</div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">{room.equipment.map(eq => <span key={eq} className="text-[8px] px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-500 font-bold border border-slate-100">{eq}</span>)}</div>
                        {room.available ? <button className="w-full py-2 rounded-lg bg-[#1a237e] text-white font-bold text-[10px]">Reservar</button> : <p className="text-[9px] text-slate-500 bg-slate-50 rounded-lg p-2 text-center border border-slate-100">{room.currentUser} · Libre: {room.nextAvailable}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StudentProfileView({ onLogout }: { onLogout: () => void }) {
    const userLoans = MOCK_LOANS.filter(l => l.userId === 'u1');
    const totalPenalty = userLoans.reduce((s, l) => s + (l.penalty || 0), 0);
    return (
        <div className="min-h-full pb-20">
            <div className="bg-gradient-to-br from-[#0d1b4a] via-[#1a237e] to-[#283593] px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#b8860b] flex items-center justify-center text-[#0d1b4a] font-black text-xl mb-3 border-4 border-white/20">{STUDENT_USER.initials}</div>
                    <h2 className="text-lg font-black text-white">{STUDENT_USER.name}</h2>
                    <p className="text-[10px] text-blue-200/50 mt-0.5">{STUDENT_USER.email}</p>
                    <div className="flex items-center gap-1.5 mt-2 bg-white/10 px-2.5 py-1 rounded-full"><GraduationCap size={10} className="text-[#c9a84c]" /><span className="text-[9px] font-bold text-[#c9a84c]">{STUDENT_USER.faculty}</span></div>
                </div>
            </div>
            <div className="px-4 -mt-3 relative z-20 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                    {[{ l: 'Semestre', v: `${STUDENT_USER.semester}°` }, { l: 'Préstamos', v: userLoans.length.toString() }, { l: 'Multas', v: totalPenalty > 0 ? `$${totalPenalty.toLocaleString('es-CL')}` : '$0' }].map(({ l, v }) => (
                        <div key={l} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center"><p className="text-base font-black text-[#0d1b4a]">{v}</p><p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{l}</p></div>
                    ))}
                </div>
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    {[{ icon: BookOpen, label: 'Historial', c: 'text-[#1a237e] bg-[#1a237e]/10' }, { icon: Heart, label: 'Favoritos', c: 'text-pink-600 bg-pink-50' }, { icon: Calendar, label: 'Calendario', c: 'text-emerald-600 bg-emerald-50' }, { icon: Bell, label: 'Notificaciones', c: 'text-blue-600 bg-blue-50' }].map(({ icon: Icon, label, c }) => (
                        <button key={label} className="w-full flex items-center gap-2.5 px-3 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c}`}><Icon size={14} /></div>
                            <span className="text-[11px] font-bold text-slate-700 flex-1 text-left">{label}</span>
                            <ChevronRight size={12} className="text-slate-300" />
                        </button>
                    ))}
                </div>
                <button onClick={onLogout} className="w-full py-3 bg-red-50 text-red-600 font-bold text-[10px] uppercase tracking-widest rounded-xl border border-red-100">Cerrar Sesión</button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   LIBRARIAN VIEWS
   ═══════════════════════════════════════════════ */
function LibrarianBottomNav({ view, onView }: { view: LibrarianView; onView: (v: LibrarianView) => void }) {
    const items = [
        { id: 'loans' as LibrarianView, icon: History, label: 'Préstamos' },
        { id: 'catalog' as LibrarianView, icon: Library, label: 'Catálogo' },
        { id: 'users' as LibrarianView, icon: Users, label: 'Usuarios' },
        { id: 'fines' as LibrarianView, icon: Wallet, label: 'Multas' },
        { id: 'reports' as LibrarianView, icon: BarChart3, label: 'Reportes' },
    ];
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t shadow-xl" style={{ borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.25rem)' }}>
            <div className="px-1 pt-1.5 pb-0.5">
                <div className="grid grid-cols-5 gap-0.5">
                    {items.map(({ id, icon: Icon, label }) => (
                        <button key={id} onClick={() => onView(id)} className={`flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-lg transition-all ${view === id ? 'text-[#1a237e]' : 'text-gray-400'}`}>
                            <Icon className={`w-4 h-4 ${view === id ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-[8px] font-bold uppercase tracking-tighter">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LibHeader({ title, sub, onLogout }: { title: string; sub: string; onLogout: () => void }) {
    return (
        <div className="bg-white/80 backdrop-blur-xl border-b shadow-sm sticky top-0 z-20 px-4 py-3" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between">
                <div><h1 className="font-bold text-base text-gray-900">{title}</h1><p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{sub}</p></div>
                <div className="flex items-center gap-2">
                    <button className="relative p-1.5 rounded-lg bg-gray-50 text-gray-400"><Bell size={16} /></button>
                    <button onClick={onLogout} className="w-7 h-7 rounded-md bg-[#1a237e] flex items-center justify-center text-white font-black text-[9px]">{LIBRARIAN_USER.initials}</button>
                </div>
            </div>
        </div>
    );
}

function LibLoansView() {
    const [tab, setTab] = useState<'active' | 'history'>('active');
    const [loans, setLoans] = useState(MOCK_LOANS);
    const active = loans.filter(l => l.status === 'active' || l.status === 'overdue');
    const hist = loans.filter(l => l.status === 'returned');
    const shown = tab === 'active' ? active : hist;
    const returnBook = (id: string) => setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'returned' as const, returnDate: new Date() } : l));

    return (
        <div className="min-h-full pb-20">
            <div className="px-4 py-3">
                <div className="flex gap-1.5 p-0.5 rounded-full bg-gray-100 border border-gray-200">
                    {([['active', `Activos (${active.length})`], ['history', 'Historial']] as ['active' | 'history', string][]).map(([id, label]) => (
                        <button key={id} onClick={() => setTab(id)} className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all ${tab === id ? 'bg-white text-[#1a237e] shadow-sm' : 'text-gray-500'}`}>{label}</button>
                    ))}
                </div>
            </div>
            <div className="px-4 space-y-2.5">
                {shown.length === 0 ? <div className="py-12 text-center text-gray-400"><History className="w-12 h-12 mb-2 mx-auto opacity-10" /><p className="text-[11px]">Sin registros</p></div> :
                shown.map(loan => (
                    <div key={loan.id} className="bg-white rounded-xl border border-gray-50 shadow-sm p-3">
                        <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0"><p className="font-bold text-[11px] text-gray-900 truncate">{loan.userName}</p><p className="text-[8px] text-gray-400 font-bold uppercase">{loan.userId} · {loan.startDate.toLocaleDateString()}</p></div>
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${loan.status === 'overdue' ? 'bg-red-100 text-red-800' : loan.status === 'returned' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>{loan.status === 'overdue' ? 'Vencido' : loan.status === 'returned' ? 'Devuelto' : 'Activo'}</span>
                        </div>
                        <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-lg mb-2 border border-slate-100">
                            <BookOpen size={14} className="text-[#1a237e] shrink-0" />
                            <div className="min-w-0"><p className="text-[10px] font-bold text-gray-800 truncate">{loan.bookTitle}</p><p className="text-[8px] text-gray-500">Vence: {loan.dueDate.toLocaleDateString()}</p></div>
                        </div>
                        {(loan.status === 'active' || loan.status === 'overdue') && <button onClick={() => returnBook(loan.id)} className="w-full py-2 rounded-lg text-[10px] font-bold text-white bg-[#1a237e] flex items-center justify-center gap-1.5"><CheckCircle size={13} /> Registrar Devolución</button>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function LibCatalogView({ books }: { books: Book[] }) {
    const [search, setSearch] = useState('');
    const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
    return (
        <div className="min-h-full pb-20">
            <div className="px-4 py-3 space-y-2.5">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <Search className="w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-[11px] outline-none" />
                </div>
                <div className="space-y-2">{filtered.map(b => (
                    <div key={b.id} className="bg-white rounded-xl border border-gray-50 shadow-sm p-3 flex gap-3">
                        <img src={b.image} alt={b.title} className="w-14 h-20 rounded-lg object-cover shadow-sm shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div><p className="font-bold text-[11px] text-gray-900 truncate">{b.title}</p><p className="text-[9px] text-[#1a237e] font-medium mt-0.5">{b.author}</p></div>
                            <div className="flex items-center justify-between">
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${b.status === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{b.status === 'available' ? 'OK' : 'Agotado'}</span>
                                <span className="text-[9px] font-black text-gray-700">{b.availableCopies}<span className="text-gray-400">/{b.totalStock}</span></span>
                            </div>
                        </div>
                    </div>
                ))}</div>
            </div>
        </div>
    );
}

function LibUsersView() {
    return (
        <div className="min-h-full pb-20 px-4 py-3 space-y-2.5">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
                <Search className="w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Buscar usuario..." className="flex-1 bg-transparent text-[11px] outline-none" />
            </div>
            {MOCK_USERS.map(user => (
                <div key={user.id} className="bg-white rounded-xl border border-gray-50 p-3 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px] shrink-0 relative">{user.name.charAt(0)}{user.role === 'admin' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border border-white rounded-full" />}</div>
                    <div className="flex-1 min-w-0"><p className="font-bold text-[11px] text-gray-800 truncate">{user.name}</p><p className="text-[8px] text-gray-400 font-bold uppercase">{user.idNumber} · {user.role}</p></div>
                    <button className="p-1.5 rounded-md bg-[#1a237e]/5 text-[#1a237e]"><Mail size={12} /></button>
                </div>
            ))}
            <div className="fixed bottom-20 right-4 z-40"><button className="flex items-center gap-1.5 pl-3 pr-4 py-2.5 rounded-full shadow-xl bg-[#1a237e] text-white font-bold text-[10px]"><Plus size={14} /> Registrar</button></div>
        </div>
    );
}

function LibFinesView() {
    const overdueLoans = MOCK_LOANS.filter(l => l.status === 'overdue' || (l.status === 'returned' && l.penalty));
    const total = overdueLoans.reduce((s, l) => s + (l.penalty || 0), 0);
    return (
        <div className="min-h-full pb-20 px-4 py-3 space-y-3">
            <div className="bg-[#1a237e] rounded-2xl p-4 text-white relative overflow-hidden">
                <Wallet size={50} className="absolute -right-2 -bottom-2 opacity-10" />
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">Recaudación</p>
                <p className="text-2xl font-black mt-1">${total.toLocaleString('es-CL')}</p>
                <div className="flex items-center gap-1.5 mt-2 text-[9px] font-bold bg-white/10 w-fit px-2 py-0.5 rounded-full"><ArrowUpRight size={10} className="text-emerald-300" />+12.5% vs ayer</div>
            </div>
            {overdueLoans.map(loan => (
                <div key={loan.id} className="bg-white rounded-xl border border-gray-50 p-3 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2.5"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${loan.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}><AlertCircle size={14} /></div><div className="min-w-0"><p className="text-[10px] font-bold text-gray-800 truncate">{loan.userName}</p><p className="text-[8px] text-gray-400">{loan.bookTitle}</p></div></div>
                    <div className="text-right"><p className={`text-[11px] font-black ${loan.status === 'overdue' ? 'text-red-600' : 'text-gray-800'}`}>${(loan.penalty || 0).toLocaleString('es-CL')}</p><p className="text-[7px] text-gray-400 font-bold uppercase">{loan.status === 'overdue' ? 'COBRAR' : 'PAGADO'}</p></div>
                </div>
            ))}
        </div>
    );
}

function LibReportsView({ books }: { books: Book[] }) {
    const stats = [
        { label: 'Préstamos Activos', val: MOCK_LOANS.filter(l => l.status === 'active' || l.status === 'overdue').length, icon: History, c: 'text-blue-600 bg-blue-50' },
        { label: 'Total Historial', val: MOCK_LOANS.length, icon: CheckCircle, c: 'text-emerald-600 bg-emerald-50' },
        { label: 'Stock Bajo', val: books.filter(b => b.availableCopies <= 2 && b.availableCopies > 0).length, icon: AlertCircle, c: 'text-amber-600 bg-amber-50' },
        { label: 'Usuarios', val: MOCK_USERS.length, icon: Users, c: 'text-purple-600 bg-purple-50' },
    ];
    return (
        <div className="min-h-full pb-20 px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 gap-2.5">{stats.map(({ label, val, icon: Icon, c }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-50 p-3 shadow-sm">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${c}`}><Icon size={14} /></div>
                    <p className="text-xl font-black text-gray-900">{val}</p>
                    <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{label}</p>
                </div>
            ))}</div>
            <div className="bg-white rounded-xl border border-gray-50 p-3 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4 text-[9px] uppercase tracking-widest">Préstamos por Género</h3>
                {[['Literatura', 12, 'bg-[#1a237e]'], ['Tecnología', 8, 'bg-blue-400'], ['Ciencias', 5, 'bg-amber-400']].map(([label, val, color]) => (
                    <div key={label as string} className="flex items-center gap-3 mb-3 last:mb-0">
                        <span className="text-[10px] font-bold text-gray-600 flex-1">{label}</span>
                        <span className="text-[10px] font-black text-gray-900">{val}</span>
                        <div className="w-20 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100"><div className={`h-full ${color}`} style={{ width: `${(val as number / 14) * 100}%` }} /></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   MASTER COMPONENT
   ═══════════════════════════════════════════════ */
export function StudentMobileApp({ books }: StudentMobileAppProps) {
    const [role, setRole] = useState<Role | null>(null);
    const [studentView, setStudentView] = useState<StudentView>('home');
    const [libView, setLibView] = useState<LibrarianView>('loans');

    const titles: Record<LibrarianView, { t: string; s: string }> = {
        loans: { t: 'Gestión Préstamos', s: 'Circulación' },
        catalog: { t: 'Catálogo', s: 'Inventario' },
        users: { t: 'Usuarios', s: 'Padrón' },
        fines: { t: 'Multas', s: 'Caja' },
        reports: { t: 'Reportes', s: 'Estadísticas' },
    };

    if (!role) return <div className="h-full w-full overflow-hidden" style={{ fontFamily: 'Inter, system-ui' }}><RoleSelector onSelect={setRole} /></div>;

    if (role === 'student') {
        return (
            <div className="h-full w-full flex flex-col bg-[#f5f7fa] overflow-hidden relative" style={{ fontFamily: 'Inter, system-ui' }}>
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {studentView === 'home' && <StudentHomeView books={books} onNav={setStudentView} />}
                    {studentView === 'catalog' && <StudentCatalogView books={books} />}
                    {studentView === 'loans' && <StudentLoansView />}
                    {studentView === 'rooms' && <StudentRoomsView />}
                    {studentView === 'profile' && <StudentProfileView onLogout={() => setRole(null)} />}
                </div>
                <StudentBottomNav view={studentView} onView={setStudentView} />
            </div>
        );
    }

    const cur = titles[libView];
    return (
        <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden relative" style={{ fontFamily: 'Inter, system-ui' }}>
            <LibHeader title={cur.t} sub={cur.s} onLogout={() => setRole(null)} />
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {libView === 'loans' && <LibLoansView />}
                {libView === 'catalog' && <LibCatalogView books={books} />}
                {libView === 'users' && <LibUsersView />}
                {libView === 'fines' && <LibFinesView />}
                {libView === 'reports' && <LibReportsView books={books} />}
            </div>
            <LibrarianBottomNav view={libView} onView={setLibView} />
        </div>
    );
}
