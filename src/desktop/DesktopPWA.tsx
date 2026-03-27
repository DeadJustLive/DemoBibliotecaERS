import { useState } from 'react';
import {
    Home, Library, BookOpen, Search, Clock,
    Bell, History, AlertCircle, CheckCircle,
    Users, Database, Settings, MapPin,
    Filter, FileText, Layout, ChevronRight,
    PlusCircle, MinusCircle, Edit, X,
    Wallet, CreditCard, ArrowUpRight,
    ShieldCheck, Bookmark, Phone, Mail, Plus, BarChart3
} from 'lucide-react';
import type { Book } from '../shared/types';
import { MOCK_LOANS, MOCK_USERS, MOCK_STUDY_ROOMS } from '../shared/mockData';

type View = 'dashboard' | 'loans' | 'catalog' | 'users' | 'fines' | 'rooms';

interface DesktopPWAProps { books: Book[]; onBookUpdate: (b: Book) => void; }

const STAFF = { name: 'Carlos Ruiz', role: 'Bibliotecario Senior', initials: 'CR' };

function Sidebar({ view, onView }: { view: View; onView: (v: View) => void }) {
    const items = [
        { id: 'dashboard' as View, icon: Home, label: 'Dashboard' },
        { id: 'loans' as View, icon: History, label: 'Préstamos' },
        { id: 'catalog' as View, icon: Library, label: 'Catálogo' },
        { id: 'users' as View, icon: Users, label: 'Usuarios' },
        { id: 'fines' as View, icon: Wallet, label: 'Multas' },
        { id: 'rooms' as View, icon: MapPin, label: 'Salas' },
    ];
    return (
        <div className="w-[220px] bg-gradient-to-b from-[#0d1b4a] to-[#1a237e] flex flex-col shrink-0 h-full">
            <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/10 text-white"><Library size={18} /></div>
                    <div>
                        <span className="text-sm font-black text-white block leading-none">SGBU</span>
                        <span className="text-[7px] font-bold text-[#c9a84c] uppercase tracking-[0.2em]">Panel Administrativo</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
                {items.map(({ id, icon: Icon, label }) => (
                    <button key={id} onClick={() => onView(id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${view === id ? 'bg-white/15 text-white shadow-lg' : 'text-blue-200/40 hover:text-white hover:bg-white/5'}`}>
                        <Icon size={15} />{label}
                    </button>
                ))}
            </div>
            <div className="p-3 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#b8860b] flex items-center justify-center text-[#0d1b4a] font-black text-[10px]">{STAFF.initials}</div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white truncate">{STAFF.name}</p>
                        <p className="text-[8px] text-blue-200/30 truncate">{STAFF.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-100 px-5 py-3 flex items-center justify-between shrink-0">
            <div>
                <h1 className="text-base font-black text-[#0d1b4a]">{title}</h1>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 w-48">
                    <Search size={12} className="text-slate-400" /><input type="text" placeholder="Buscar..." className="bg-transparent text-[11px] text-slate-800 outline-none w-full" />
                </div>
                <button className="relative p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-400"><Bell size={14} /><span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" /></button>
            </div>
        </div>
    );
}

function DashboardView({ books }: { books: Book[] }) {
    const activeLoans = MOCK_LOANS.filter(l => l.status === 'active' || l.status === 'overdue');
    const overdueLoans = MOCK_LOANS.filter(l => l.status === 'overdue');
    const totalPenalty = MOCK_LOANS.reduce((s, l) => s + (l.penalty || 0), 0);
    const lowStock = books.filter(b => b.availableCopies <= 2 && b.availableCopies > 0);

    return (
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Préstamos Activos', val: activeLoans.length, icon: BookOpen, color: 'text-blue-700 bg-blue-50' },
                    { label: 'Vencidos', val: overdueLoans.length, icon: AlertCircle, color: 'text-red-700 bg-red-50' },
                    { label: 'Recaudación', val: `$${totalPenalty.toLocaleString('es-CL')}`, icon: Wallet, color: 'text-emerald-700 bg-emerald-50' },
                    { label: 'Stock Bajo', val: lowStock.length, icon: Library, color: 'text-amber-700 bg-amber-50' },
                ].map(({ label, val, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color}`}><Icon size={16} /></div>
                        <p className="text-xl font-black text-slate-800">{val}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-[11px] font-black text-[#0d1b4a] uppercase tracking-wider">Préstamos Recientes</h3>
                        <span className="text-[8px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{MOCK_LOANS.length} total</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {MOCK_LOANS.slice(0, 5).map(loan => (
                            <div key={loan.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loan.status === 'overdue' ? 'bg-red-50 text-red-500' : loan.status === 'returned' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                                    {loan.status === 'returned' ? <CheckCircle size={14} /> : <BookOpen size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-slate-800 truncate">{loan.bookTitle}</p>
                                    <p className="text-[9px] text-slate-400">{loan.userName} · {loan.dueDate.toLocaleDateString()}</p>
                                </div>
                                <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${loan.status === 'overdue' ? 'bg-red-100 text-red-700' : loan.status === 'returned' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {loan.status === 'overdue' ? 'Vencido' : loan.status === 'returned' ? 'Devuelto' : 'Activo'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                        <h3 className="text-[10px] font-black text-[#0d1b4a] uppercase tracking-wider mb-3">Stock Bajo</h3>
                        <div className="space-y-2">
                            {lowStock.slice(0, 4).map(b => (
                                <div key={b.id} className="flex items-center gap-2 p-2 bg-amber-50/50 rounded-lg border border-amber-100">
                                    <BookOpen size={12} className="text-amber-600 shrink-0" />
                                    <p className="text-[10px] font-bold text-slate-700 truncate flex-1">{b.title}</p>
                                    <span className="text-[9px] font-black text-amber-700">{b.availableCopies}/{b.totalStock}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                        <h3 className="text-[10px] font-black text-[#0d1b4a] uppercase tracking-wider mb-3">Salas</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                                <p className="text-lg font-black text-emerald-700">{MOCK_STUDY_ROOMS.filter(r => r.available).length}</p>
                                <p className="text-[7px] font-bold text-emerald-600 uppercase">Libres</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                                <p className="text-lg font-black text-red-700">{MOCK_STUDY_ROOMS.filter(r => !r.available).length}</p>
                                <p className="text-[7px] font-bold text-red-600 uppercase">Ocupadas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoansManageView() {
    const [tab, setTab] = useState<'active' | 'history'>('active');
    const active = MOCK_LOANS.filter(l => l.status === 'active' || l.status === 'overdue');
    const history = MOCK_LOANS.filter(l => l.status === 'returned');
    const shown = tab === 'active' ? active : history;

    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex gap-2 p-0.5 rounded-lg bg-slate-100 border border-slate-200 w-fit">
                {([['active', `Activos (${active.length})`], ['history', 'Historial']] as ['active' | 'history', string][]).map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)} className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${tab === id ? 'bg-white text-[#1a237e] shadow-sm' : 'text-slate-500'}`}>{label}</button>
                ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-[11px]">
                    <thead><tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                        <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Libro</th>
                        <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Vence</th>
                        <th className="px-4 py-2 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                        <th className="px-4 py-2 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Acciones</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                        {shown.map(loan => (
                            <tr key={loan.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-2.5"><p className="font-bold text-slate-800">{loan.userName}</p><p className="text-[8px] text-slate-400">ID: {loan.userId}</p></td>
                                <td className="px-4 py-2.5 text-slate-700">{loan.bookTitle}</td>
                                <td className="px-4 py-2.5 text-slate-500">{loan.dueDate.toLocaleDateString()}</td>
                                <td className="px-4 py-2.5"><span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${loan.status === 'overdue' ? 'bg-red-100 text-red-700' : loan.status === 'returned' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{loan.status === 'overdue' ? 'Vencido' : loan.status === 'returned' ? 'Devuelto' : 'Activo'}</span></td>
                                <td className="px-4 py-2.5 text-right">{(loan.status === 'active' || loan.status === 'overdue') && <button className="px-2.5 py-1 rounded-md text-[9px] font-bold text-white bg-[#1a237e]">Devolver</button>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CatalogManageView({ books, onBookUpdate }: { books: Book[]; onBookUpdate: (b: Book) => void }) {
    const [search, setSearch] = useState('');
    const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));
    const updateCopies = (b: Book, delta: number) => {
        const newTotal = Math.max(0, b.totalStock + delta);
        const newAvail = Math.max(0, b.availableCopies + delta);
        if (newTotal !== b.totalStock) onBookUpdate({ ...b, totalStock: newTotal, availableCopies: newAvail, status: newAvail === 0 ? 'out_of_stock' : newAvail < 2 ? 'low_stock' : 'available' });
    };

    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Search size={13} className="text-slate-400" /><input type="text" placeholder="Buscar libro..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-[11px] outline-none" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1a237e] text-white rounded-lg text-[10px] font-bold shadow-md"><Plus size={13} /> Agregar</button>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                {filtered.map(b => (
                    <div key={b.id} className="px-4 py-3 flex items-center gap-3">
                        <img src={b.image} alt={b.title} className="w-10 h-14 rounded-lg object-cover shadow-sm shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 truncate">{b.title}</p>
                            <p className="text-[9px] text-slate-400">{b.author} · {b.category}</p>
                        </div>
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase ${b.status === 'available' ? 'bg-emerald-50 text-emerald-700' : b.status === 'low_stock' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                            {b.status === 'available' ? 'OK' : b.status === 'low_stock' ? 'Bajo' : 'Agotado'}
                        </span>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                            <button onClick={() => updateCopies(b, -1)} disabled={b.totalStock === 0} className="p-0.5 text-slate-300 disabled:opacity-30"><MinusCircle size={16} /></button>
                            <span className="w-5 text-center font-black text-slate-900 text-[11px]">{b.totalStock}</span>
                            <button onClick={() => updateCopies(b, 1)} className="p-0.5 text-[#1a237e]"><PlusCircle size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UsersManageView() {
    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Search size={13} className="text-slate-400" /><input type="text" placeholder="Buscar usuario..." className="flex-1 bg-transparent text-[11px] outline-none" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1a237e] text-white rounded-lg text-[10px] font-bold shadow-md"><Plus size={13} /> Registrar</button>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50">
                {MOCK_USERS.map(user => (
                    <div key={user.id} className="px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black text-[11px] relative shrink-0">
                            {user.name.charAt(0)}
                            {user.role === 'admin' && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center"><ShieldCheck size={7} className="text-white" /></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-800">{user.name}</p>
                            <p className="text-[9px] text-slate-400">ID: {user.idNumber} · {user.role}{user.faculty ? ` · ${user.faculty}` : ''}</p>
                        </div>
                        <div className="flex gap-1.5">
                            <button className="p-1.5 rounded-md bg-slate-50 text-slate-400"><Phone size={12} /></button>
                            <button className="p-1.5 rounded-md bg-[#1a237e]/5 text-[#1a237e]"><Mail size={12} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FinesView() {
    const overdueLoans = MOCK_LOANS.filter(l => l.status === 'overdue' || (l.status === 'returned' && l.penalty));
    const total = overdueLoans.reduce((s, l) => s + (l.penalty || 0), 0);
    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#1a237e] rounded-xl p-4 text-white relative overflow-hidden">
                    <Wallet size={50} className="absolute -right-2 -bottom-2 opacity-10" />
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50">Recaudación Total</p>
                    <p className="text-2xl font-black mt-1">${total.toLocaleString('es-CL')}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Pendientes</p>
                    <p className="text-xl font-black text-red-700 mt-1">$15.200</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Condonadas</p>
                    <p className="text-xl font-black text-slate-800 mt-1">$0</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100"><h3 className="text-[10px] font-black text-[#0d1b4a] uppercase tracking-wider">Multas Recientes</h3></div>
                <div className="divide-y divide-slate-50">
                    {overdueLoans.map(loan => (
                        <div key={loan.id} className="px-4 py-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${loan.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}><AlertCircle size={14} /></div>
                                <div><p className="text-[11px] font-bold text-slate-800">{loan.userName}</p><p className="text-[8px] text-slate-400">{loan.bookTitle}</p></div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-black ${loan.status === 'overdue' ? 'text-red-600' : 'text-slate-800'}`}>${(loan.penalty || 0).toLocaleString('es-CL')}</p>
                                <p className="text-[7px] text-slate-400 font-bold uppercase">{loan.status === 'overdue' ? 'POR COBRAR' : 'PAGADO'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function RoomsManageView() {
    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"><p className="text-2xl font-black text-[#0d1b4a]">{MOCK_STUDY_ROOMS.length}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</p></div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100"><p className="text-2xl font-black text-emerald-700">{MOCK_STUDY_ROOMS.filter(r => r.available).length}</p><p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Libres</p></div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100"><p className="text-2xl font-black text-red-700">{MOCK_STUDY_ROOMS.filter(r => !r.available).length}</p><p className="text-[8px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Ocupadas</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {MOCK_STUDY_ROOMS.map(room => (
                    <div key={room.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <div><h3 className="font-bold text-[11px] text-slate-800">{room.name}</h3><p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Piso {room.floor} · {room.capacity} pers.</p></div>
                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase ${room.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${room.available ? 'bg-emerald-500' : 'bg-red-500'}`} />{room.available ? 'Libre' : 'Ocupada'}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">{room.equipment.map(eq => <span key={eq} className="text-[8px] px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-500 font-bold border border-slate-100">{eq}</span>)}</div>
                        {!room.available && <p className="text-[9px] text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100 text-center">{room.currentUser} · Libre a las {room.nextAvailable}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

const VIEW_TITLES: Record<View, { title: string; sub: string }> = {
    dashboard: { title: 'Dashboard', sub: 'Panel de Control' },
    loans: { title: 'Gestión de Préstamos', sub: 'Circulación Bibliográfica' },
    catalog: { title: 'Gestión de Catálogo', sub: 'Inventario y Stock' },
    users: { title: 'Padrón de Usuarios', sub: 'Estudiantes y Personal' },
    fines: { title: 'Caja y Multas', sub: 'Administración Financiera' },
    rooms: { title: 'Salas de Estudio', sub: 'Administración de Espacios' },
};

export function DesktopPWA({ books, onBookUpdate }: DesktopPWAProps) {
    const [view, setView] = useState<View>('dashboard');
    return (
        <div className="h-full w-full flex bg-[#f5f7fa] overflow-hidden" style={{ fontFamily: 'Inter, system-ui' }}>
            <Sidebar view={view} onView={setView} />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <TopBar title={VIEW_TITLES[view].title} subtitle={VIEW_TITLES[view].sub} />
                {view === 'dashboard' && <DashboardView books={books} />}
                {view === 'loans' && <LoansManageView />}
                {view === 'catalog' && <CatalogManageView books={books} onBookUpdate={onBookUpdate} />}
                {view === 'users' && <UsersManageView />}
                {view === 'fines' && <FinesView />}
                {view === 'rooms' && <RoomsManageView />}
            </div>
        </div>
    );
}
