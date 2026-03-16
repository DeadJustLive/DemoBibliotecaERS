import { useState } from 'react';
import {
    BarChart3, Bell, Package, Settings, Search, Plus,
    PlusCircle, MinusCircle, X, Check, ChevronRight, Clock,
    BookOpen, Library, History, Bookmark, ShieldCheck,
    AlertCircle, CheckCircle, Edit, Users, Wallet, CreditCard,
    ArrowUpRight, ArrowDownLeft, Filter, Phone, Mail
} from 'lucide-react';
import type { Book, Loan, User as UserType } from '../shared/types';
import { MOCK_LOANS, MOCK_USERS } from '../shared/mockData';

type View = 'loans' | 'catalog' | 'users' | 'fines' | 'reports' | 'notifications' | 'settings';
type LoanTab = 'inbox' | 'active' | 'history';

interface MobileAppProps {
    books: Book[];
    onBookUpdate: (b: Book) => void;
}

const EMPRESA = 'SGBU - Biblioteca';

// ── Status helpers ─────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    active: 'En préstamo',
    overdue: 'Atrasado',
    returned: 'Devuelto',
};
const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    active: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    returned: 'bg-emerald-100 text-emerald-800',
};

function timeAgo(date: Date) {
    const diff = Date.now() - date.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `hace ${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h}h`;
    return `hace ${Math.floor(h / 24)}d`;
}

// ── BottomNav ──────────────────────────────────────────────────────────────
function BottomNav({ view, onView }: { view: View; onView: (v: View) => void }) {
    const items = [
        { id: 'loans' as View, icon: History, label: 'Préstamos' },
        { id: 'catalog' as View, icon: Library, label: 'Catálogo' },
        { id: 'users' as View, icon: Users, label: 'Usuarios' },
        { id: 'fines' as View, icon: Wallet, label: 'Caja' },
        { id: 'reports' as View, icon: BarChart3, label: 'Reportes' },
    ];
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t shadow-lg" style={{ borderColor: 'rgba(0,0,0,0.05)', paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.5rem)' }}>
            <div className="px-2 pt-2 pb-1">
                <div className="grid grid-cols-5 gap-1">
                    {items.map(({ id, icon: Icon, label }) => {
                        const active = view === id;
                        return (
                            <button
                                key={id}
                                onClick={() => onView(id)}
                                className={`flex flex-col items-center gap-1 px-1 py-2 rounded-xl transition-all ${active ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-400 hover:text-gray-700'}`}
                            >
                                <Icon className={`w-5 h-5 ${active ? 'scale-110' : ''} transition-transform`} />
                                <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ── Header Shell Component ──────────────────────────────────────────────────
function ViewHeader({ title, subtitle, onView, notifCount }: { title: string; subtitle: string; onView: (v: View) => void; notifCount: number }) {
    return (
        <div className="bg-white/80 backdrop-blur-xl border-b shadow-sm sticky top-0 z-20" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <div className="px-4 py-4 flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-lg text-gray-900 leading-tight">{title}</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">{subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => onView('notifications')} className="relative p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Bell size={18} />
                        {notifCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />}
                    </button>
                    <button onClick={() => onView('settings')} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Settings size={18} />
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">CR</div>
                </div>
            </div>
        </div>
    );
}

// ── UsersView ────────────────────────────────────────────────────
function UsersView() {
    const [search, setSearch] = useState('');
    const filtered = MOCK_USERS.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.idNumber.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-full pb-24">
            <div className="px-4 py-4 space-y-4">
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar por nombre o ID..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800 font-medium" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {filtered.map(user => (
                        <div key={user.id} className="bg-white rounded-2xl border border-gray-50 p-4 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black relative">
                                {user.name.charAt(0)}
                                {user.role === 'admin' && <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center"><ShieldCheck size={8} className="text-white" /></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {user.idNumber} · {user.role}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-gray-50 text-gray-400"><Phone size={14} /></button>
                                <button className="p-2 rounded-lg bg-indigo-50 text-indigo-400"><Mail size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-24 right-4 z-40">
                <button className="flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full shadow-xl bg-indigo-600 text-white font-bold text-sm hover:scale-105 transition-all">
                    <Plus size={18} /> Registrar Usuario
                </button>
            </div>
        </div>
    );
}

// ── FinesView (Caja) ────────────────────────────────────────────────────
function FinesView() {
    const overdueLoans = MOCK_LOANS.filter(l => l.status === 'overdue' || (l.status === 'returned' && l.penalty));
    const totalCollected = overdueLoans.reduce((sum, l) => sum + (l.penalty || 0), 0);

    return (
        <div className="min-h-full pb-24">
            <div className="px-4 py-4 space-y-4">
                {/* Balance Card */}
                <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                    <Wallet size={80} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Recaudación diaria</p>
                    <h2 className="text-3xl font-black mt-2 leading-none">${totalCollected.toLocaleString('es-CL')}</h2>
                    <div className="flex items-center gap-2 mt-4 text-[11px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                        <ArrowUpRight size={14} className="text-emerald-300" />
                        <span>+12.5% vs ayer</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm flex flex-col gap-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Pendientes</p>
                        <p className="text-xl font-black text-gray-800">$15.200</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm flex flex-col gap-1">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Condonadas</p>
                        <p className="text-xl font-black text-gray-800">$0</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                        <span>Multas Recientes</span>
                        <Filter size={12} />
                    </div>
                    {overdueLoans.map(loan => (
                        <div key={loan.id} className="bg-white rounded-2xl border border-gray-50 p-4 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${loan.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                    <AlertCircle size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-800 truncate">{loan.userName}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{loan.bookTitle}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-black ${loan.status === 'overdue' ? 'text-red-500' : 'text-gray-800'}`}>
                                    ${(loan.penalty || 0).toLocaleString('es-CL')}
                                </p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                    {loan.status === 'overdue' ? 'POR COBRAR' : 'PAGADO'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-24 right-4 z-40">
                <button className="flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full shadow-xl bg-indigo-600 text-white font-bold text-sm">
                    <CreditCard size={18} /> Nueva Operación
                </button>
            </div>
        </div>
    );
}

// ── LoansView ────────────────────────────────────────────────────
function LoansView() {
    const [tab, setTab] = useState<LoanTab>('active');
    const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);

    const pendingLoans = loans.filter(l => l.status === 'pending');
    const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'overdue');
    const historyLoans = loans.filter(l => l.status === 'returned');

    const approve = (id: string) => setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'active', startDate: new Date() } : l));
    const returnBook = (id: string) => setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'returned', returnDate: new Date() } : l));
    
    const shown = tab === 'inbox' ? pendingLoans : tab === 'active' ? activeLoans : historyLoans;

    return (
        <div className="min-h-full pb-24">
            <div className="px-4 py-4">
                <div className="flex gap-2 p-1 rounded-full bg-gray-100 border border-gray-200">
                    {([['inbox', `Sala Wait (${pendingLoans.length})`], ['active', `En Mano (${activeLoans.length})`], ['history', 'Historial']] as [LoanTab, string][]).map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex-1 px-3 py-2 rounded-full transition-all text-[11px] font-bold ${tab === id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 space-y-3">
                {shown.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <History className="w-16 h-16 mb-4 opacity-10" />
                        <p className="font-medium text-sm">Sin registros aquí</p>
                    </div>
                )}
                {shown.map(loan => (
                    <div key={loan.id} className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden transition-all active:scale-[0.98]">
                        <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{loan.userName}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: {loan.userId} · {timeAgo(loan.startDate)}</p>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${STATUS_COLORS[loan.status]}`}>
                                    {STATUS_LABELS[loan.status]}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3 border border-slate-100">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
                                    <BookOpen size={16} className="text-indigo-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate leading-tight">{loan.bookTitle}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5 tracking-tighter">Vence: {loan.dueDate.toLocaleDateString()}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Clock size={12} />
                                    <span className="text-[9px] uppercase font-bold tracking-[0.2em]">{loan.id.split('-')[0]}</span>
                                </div>
                                {loan.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 transition-colors">Rechazar</button>
                                        <button onClick={() => approve(loan.id)} className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 shadow-md">Aprobar</button>
                                    </div>
                                )}
                                {(loan.status === 'active' || loan.status === 'overdue') && (
                                    <button onClick={() => returnBook(loan.id)} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md flex items-center gap-2">
                                        <CheckCircle size={14} /> Registrar Devolución
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── CatalogView ────────────────────────────────────────────────────
function CatalogView({ books, onBookUpdate }: { books: Book[]; onBookUpdate: (b: Book) => void }) {
    const [activeTab, setActiveTab] = useState<'books' | 'stock'>('books');
    const [search, setSearch] = useState('');
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

    const updateCopies = (b: Book, delta: number) => {
        const newTotal = Math.max(0, b.totalStock + delta);
        const newAvailable = Math.max(0, b.availableCopies + delta);
        if (newTotal !== b.totalStock) {
            onBookUpdate({ 
                ...b, 
                totalStock: newTotal, 
                availableCopies: newAvailable,
                status: newAvailable === 0 ? 'out_of_stock' : (newAvailable < 2 ? 'low_stock' : 'available')
            });
        }
    };

    return (
        <div className="min-h-full pb-24">
            <div className="px-4 py-4 space-y-4">
                <div className="flex p-1 rounded-full bg-gray-100 border border-gray-200">
                    {(['books', 'stock'] as const).map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-1.5 px-4 rounded-full text-[11px] font-bold transition-all ${activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}>
                            {t === 'books' ? 'Listado' : 'Ajuste Stock'}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Buscar en biblioteca..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800 font-medium" />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {activeTab === 'books' ? (
                        filtered.map(b => (
                            <div key={b.id} className="bg-white rounded-2xl border border-gray-50 shadow-sm p-4 flex gap-4 transition-all active:scale-[0.98]">
                                {b.image ? <img src={b.image} alt={b.title} className="w-20 h-28 rounded-xl object-cover shadow-md shrink-0 border border-gray-50" /> : <div className="w-20 h-28 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0"><BookOpen size={24} className="text-gray-200" /></div>}
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div className="min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="font-bold text-gray-900 truncate text-base leading-tight">{b.title}</p>
                                            <button onClick={() => setEditingBook(b)} className="p-1.5 text-gray-300"><Edit size={14} /></button>
                                        </div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1 truncate">{b.author}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                            b.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>{b.status === 'available' ? 'Disponible' : 'Agotado'}</span>
                                        {b.isFeatured && <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Relieve</span>}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Bookmark size={12} className="text-indigo-400" />
                                        <span className="text-[10px] font-black text-gray-700">{b.availableCopies} <span className="text-gray-400">/ {b.totalStock}</span></span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        filtered.map(b => (
                            <div key={b.id} className="bg-white rounded-2xl border border-gray-50 shadow-sm p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    {b.image ? <img src={b.image} alt={b.title} className="w-12 h-16 rounded-lg object-cover shadow-sm" /> : <div className="w-12 h-16 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100"><BookOpen size={16} className="text-gray-200" /></div>}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate text-sm leading-none">{b.title}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-1.5">{b.author}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-indigo-600 leading-none">{b.availableCopies}</p>
                                        <p className="text-[8px] text-gray-400 font-black tracking-widest mt-1">DISP.</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-black text-gray-400 uppercase ml-2">Total ejemplares:</span>
                                    <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-slate-200">
                                        <button onClick={() => updateCopies(b, -1)} disabled={b.totalStock === 0} className="p-1 px-2 text-gray-300 disabled:opacity-30"><MinusCircle size={20} /></button>
                                        <span className="w-6 text-center font-black text-gray-900 text-sm">{b.totalStock}</span>
                                        <button onClick={() => updateCopies(b, +1)} className="p-1 px-2 text-indigo-500"><PlusCircle size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {editingBook && (
                <div className="fixed inset-0 z-50 flex items-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingBook(null)} />
                    <div className="relative bg-white w-full rounded-t-[2.5rem] p-8 space-y-4 shadow-2xl flex flex-col">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-gray-900">Detalles del Libro</h3>
                            <button onClick={() => setEditingBook(null)} className="p-2 rounded-full bg-gray-100 text-gray-500"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Título</label>
                                <input className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all" value={editingBook.title} onChange={e => setEditingBook({ ...editingBook, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Autor</label>
                                <input className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all" value={editingBook.author} onChange={e => setEditingBook({ ...editingBook, author: e.target.value })} />
                            </div>
                        </div>
                        <button onClick={() => { onBookUpdate(editingBook); setEditingBook(null); }} className="w-full py-4 rounded-2xl font-black text-white bg-indigo-600 shadow-xl shadow-indigo-100 mt-4 uppercase tracking-[0.2em] text-xs">Guardar Ficha</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── ReportsView ────────────────────────────────────────────────────
function ReportsView({ books }: { books: Book[] }) {
    const activeLoans = MOCK_LOANS.filter(l => l.status === 'active' || l.status === 'overdue').length;
    const stats = [
        { label: 'Préstamos Activos', value: activeLoans.toString(), icon: History, color: 'text-blue-600 bg-blue-50' },
        { label: 'Historial Total', value: MOCK_LOANS.length.toString(), icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Poco Inventario', value: books.filter(b => b.availableCopies <= 2 && b.availableCopies > 0).length.toString(), icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
        { label: 'Usuarios', value: MOCK_USERS.length.toString(), icon: Users, color: 'text-purple-600 bg-purple-50' },
    ];

    return (
        <div className="min-h-full pb-24">
            <div className="px-4 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-2xl border border-gray-50 p-4 shadow-sm">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={18} /></div>
                            <p className="text-2xl font-black text-gray-900">{value}</p>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 leading-tight">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-50 p-4 shadow-sm">
                    <h3 className="font-black text-gray-900 mb-6 text-[10px] uppercase tracking-widest">Préstamos por Género</h3>
                    {[['Literatura', 12, 'bg-indigo-400'], ['Tecnología', 8, 'bg-blue-400'], ['Ciencias', 5, 'bg-amber-400']].map(([label, val, color]) => (
                        <div key={label as string} className="flex items-center gap-4 mb-5 last:mb-0">
                            <span className="text-[11px] font-bold text-gray-600 flex-1">{label}</span>
                            <span className="text-[11px] font-black text-gray-900">{val}</span>
                            <div className="w-24 h-1.5 bg-slate-50 rounded-full overflow-hidden shrink-0 border border-slate-100">
                                <div className={`h-full ${color}`} style={{ width: `${(val as number / 14) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── NotificationsView ────────────────────────────────────────────────────
function NotificationsView({ onBack }: { onBack: () => void }) {
    const overdue = MOCK_LOANS.filter(l => l.status === 'overdue');
    const pending = MOCK_LOANS.filter(l => l.status === 'pending');
    const notifs = [
        ...overdue.map(l => ({ id: l.id, type: 'alert', title: 'Expirado', sub: `${l.userName}: ${l.bookTitle}`, read: false, icon: AlertCircle, color: 'text-red-600 bg-red-50' })),
        ...pending.map(l => ({ id: l.id, type: 'request', title: 'Solicitud', sub: `${l.userName} espera libro`, read: false, icon: Bookmark, color: 'text-amber-600 bg-amber-50' })),
        { id: 'n1', type: 'info', title: 'Inventario', sub: '5 libros nuevos recibidos', read: true, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    ];

    return (
        <div className="min-h-full bg-white z-50 pt-2 pb-24">
            <div className="px-4 py-4 flex items-center justify-between border-b mb-2">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-50"><X size={20} /></button>
                <h2 className="text-base font-black uppercase tracking-widest">Notificaciones</h2>
                <div className="w-8" />
            </div>
            <div className="px-4 py-2 space-y-3">
                {notifs.map(n => (
                    <div key={n.id} className={`bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 ${!n.read ? 'bg-indigo-50/20' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}><n.icon size={20} /></div>
                        <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{n.title}</p>
                            <p className="text-[11px] text-gray-500 font-medium mt-1 leading-tight">{n.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── SettingsView ───────────────────────────────────────────────────────────────
function SettingsView({ onBack }: { onBack: () => void }) {
    const sections = [
        { title: 'Gestión', items: ['Perfil Biblioteca', 'Reglas Préstamo', 'Multas'] },
        { title: 'Personal', items: ['Usuarios Admin', 'Roles', 'Backup'] },
    ];
    return (
        <div className="min-h-full bg-white z-50 pt-2 pb-24">
            <div className="px-4 py-4 flex items-center justify-between border-b mb-6">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-50"><X size={20} /></button>
                <h2 className="text-base font-black uppercase tracking-widest">Ajustes</h2>
                <div className="w-8" />
            </div>
            <div className="px-4 space-y-4">
                <div className="bg-indigo-600 rounded-3xl p-5 flex items-center gap-4 text-white shadow-xl shadow-indigo-100">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center font-black text-2xl border border-white/20">CR</div>
                    <div>
                        <p className="font-black text-lg leading-none">Carlos Ruiz</p>
                        <p className="text-xs text-indigo-200 mt-1">Bibliotecario Senior</p>
                    </div>
                </div>
                {sections.map(({ title, items }) => (
                    <div key={title} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-4 py-2 bg-slate-100/50 border-b border-slate-100">
                            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
                        </div>
                        {items.map(item => (
                            <button key={item} className="w-full flex items-center justify-between px-4 py-4 border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
                                <span className="text-xs font-bold text-gray-600">{item}</span>
                                <ChevronRight size={14} className="text-gray-300" />
                            </button>
                        ))}
                    </div>
                ))}
                <button className="w-full py-4 bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-red-100 mt-4">Cerrar Sesión</button>
            </div>
        </div>
    );
}

// ── MobileApp Master ────────────────────────────────────────────────────────
export function MobileApp({ books, onBookUpdate }: MobileAppProps) {
    const [view, setView] = useState<View>('loans');
    const pendingCount = MOCK_LOANS.filter(l => l.status === 'pending').length;

    const views: Record<string, { title: string; sub: string }> = {
        loans: { title: 'Gestión Préstamos', sub: 'Control de Circulación' },
        catalog: { title: 'Fondos y Colecciones', sub: 'Catálogo Bibliográfico' },
        users: { title: 'Padrón de Usuarios', sub: 'Estudiantes y Personal' },
        fines: { title: 'Caja y Multas', sub: 'Administración Financiera' },
        reports: { title: 'Estadísticas SGBU', sub: 'Indicadores de Gestión' },
    };

    const currentView = views[view] || { title: 'Configuración', sub: 'Sistema de Gestión' };

    return (
        <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden relative" style={{ fontFamily: 'Inter, system-ui' }}>
            {view !== 'notifications' && view !== 'settings' && (
                <ViewHeader 
                    title={currentView.title} 
                    subtitle={currentView.sub} 
                    onView={setView} 
                    notifCount={pendingCount} 
                />
            )}
            
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {view === 'loans' && <LoansView />}
                {view === 'catalog' && <CatalogView books={books} onBookUpdate={onBookUpdate} />}
                {view === 'users' && <UsersView />}
                {view === 'fines' && <FinesView />}
                {view === 'reports' && <ReportsView books={books} />}
                {view === 'notifications' && <NotificationsView onBack={() => setView('loans')} />}
                {view === 'settings' && <SettingsView onBack={() => setView('loans')} />}
            </div>
            
            {(view !== 'notifications' && view !== 'settings') && (
                <BottomNav view={view} onView={setView} />
            )}
        </div>
    );
}
