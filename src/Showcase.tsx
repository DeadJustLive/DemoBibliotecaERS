import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Library, Laptop, ChevronRight, Sparkles, GraduationCap, BookOpen, Globe } from 'lucide-react';
import type { AppMessage } from './shared/types';

type ActiveView = 'web' | 'student' | 'desktop';

export function Showcase() {
    const baseUrl = window.location.origin + window.location.pathname;
    const [activeView, setActiveView] = useState<ActiveView>('web');

    useEffect(() => {
        const handler = (e: MessageEvent<AppMessage>) => {
            if (!e.data || !e.data.type) return;
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                if (iframe.contentWindow && iframe.contentWindow !== e.source) {
                    iframe.contentWindow.postMessage(e.data, '*');
                }
            });
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    const views: { id: ActiveView; label: string; icon: typeof Monitor; sub: string; color: string }[] = [
        { id: 'web', label: 'Portal Web', icon: Monitor, sub: 'Catálogo y servicios para estudiantes', color: 'from-[#1a237e] to-[#283593]' },
        { id: 'student', label: 'App Móvil', icon: Smartphone, sub: 'Experiencia nativa para universitarios', color: 'from-[#00796b] to-[#00897b]' },
        { id: 'desktop', label: 'App Desktop (PWA)', icon: Laptop, sub: 'Dashboard completo para computadoras', color: 'from-[#b8860b] to-[#c9a84c]' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="px-6 lg:px-8 py-4 bg-white/[0.03] backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-[#1a237e] to-[#283593] rounded-xl shadow-lg shadow-indigo-900/30 text-white">
                        <Library size={22} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight">SGBU — Showcase</h1>
                        <p className="text-[9px] text-[#c9a84c] uppercase font-black tracking-[0.25em]">Sistema de Gestión Bibliotecaria · 3 en 1</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-white/30">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Sincronizado
                        </div>
                    </div>
                </div>
            </header>

            {/* View Selector Tabs */}
            <div className="px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-3 shrink-0 border-b border-white/[0.04]">
                {views.map(({ id, label, icon: Icon, sub, color }) => (
                    <button
                        key={id}
                        onClick={() => setActiveView(id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all flex-1 ${activeView === id
                            ? `bg-gradient-to-r ${color} shadow-xl border border-white/10`
                            : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                        }`}
                    >
                        <div className={`p-2 rounded-lg ${activeView === id ? 'bg-white/20' : 'bg-white/5'}`}>
                            <Icon size={16} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold">{label}</p>
                            <p className="text-[9px] opacity-50">{sub}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* Web Portal View */}
                {activeView === 'web' && (
                    <div className="flex-1 relative flex flex-col bg-[#f5f7fa]">
                        <div className="h-9 bg-slate-100 flex items-center px-4 justify-between border-b border-slate-200 shrink-0">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Globe size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Portal del Estudiante · Escritorio</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={`${baseUrl}?view=web`}
                                className="w-full h-full border-none"
                                title="SGBU Web Portal"
                            />
                        </div>
                    </div>
                )}

                {/* Student Mobile App View */}
                {activeView === 'student' && (
                    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-[#0a0f1e] to-[#0d1b3a]">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-5 text-emerald-300/60">
                                <Smartphone size={14} />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">App Móvil Universitaria</span>
                            </div>

                            {/* Phone Frame */}
                            <div className="relative w-[320px] h-[680px] bg-black rounded-[3rem] shadow-2xl border-[8px] border-slate-800/80 flex flex-col overflow-hidden ring-4 ring-white/[0.04]">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-50 flex items-center justify-center">
                                    <div className="w-14 h-1 bg-slate-800 rounded-full" />
                                </div>

                                <iframe
                                    src={`${baseUrl}?view=student`}
                                    className="w-full h-full border-none"
                                    title="SGBU Student Mobile"
                                />

                                {/* Home indicator */}
                                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-white/15 rounded-full z-50" />
                            </div>

                            <div className="mt-6 max-w-[280px] text-center">
                                <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                                    <span className="text-[#c9a84c] font-bold">App Estudiante:</span> Accede a préstamos, catálogo, salas de estudio y perfil desde tu teléfono.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop PWA View */}
                {activeView === 'desktop' && (
                    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-[#0a0f1e] to-[#0d1b3a]">
                        <div className="flex flex-col items-center w-full max-w-[900px]">
                            <div className="flex items-center gap-2 mb-5 text-[#c9a84c]/60">
                                <Laptop size={14} />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em]">App PWA Desktop</span>
                            </div>

                            {/* Desktop Frame */}
                            <div className="w-full">
                                <div className="bg-slate-800 rounded-t-xl px-4 py-2 flex items-center gap-3 border-b border-slate-700">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="flex-1 bg-slate-700/50 rounded-lg px-3 py-1 text-[9px] text-slate-400 font-mono">
                                        biblioteca.universidad.edu/app
                                    </div>
                                </div>
                                <div className="bg-white rounded-b-xl overflow-hidden shadow-2xl ring-4 ring-white/5" style={{ height: '500px' }}>
                                    <iframe
                                        src={`${baseUrl}?view=desktop`}
                                        className="w-full h-full border-none"
                                        title="SGBU Desktop PWA"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 max-w-[400px] text-center">
                                <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                                    <span className="text-[#c9a84c] font-bold">PWA Desktop:</span> Dashboard completo con sidebar, catálogo, préstamos, recursos digitales y salas. Instalable como app nativa.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <div className="h-10 bg-gradient-to-r from-[#1a237e] to-[#283593] px-6 lg:px-8 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] shrink-0 border-t border-indigo-400/10">
                <span className="flex items-center gap-2"><Sparkles size={10} className="text-[#c9a84c]" /> Demo Interactiva SGBU</span>
                <span className="opacity-30">|</span>
                <span className="opacity-50">Propuesta Biblioteca Universitaria · 3 en 1</span>
            </div>
        </div>
    );
}
