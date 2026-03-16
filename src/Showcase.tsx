import { useEffect } from 'react';
import { Monitor, Smartphone, Library, ExternalLink } from 'lucide-react';
import type { AppMessage } from './shared/types';

export function Showcase() {
    const baseUrl = window.location.origin + window.location.pathname;

    // Sincronización entre iframes: cuando uno envía un mensaje, el padre lo retransmite a ambos
    useEffect(() => {
        const handler = (e: MessageEvent<AppMessage>) => {
            if (!e.data || !e.data.type) return;
            
            // Retransmitir a todos los iframes hijos
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

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="px-8 py-4 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20 text-white">
                        <Library size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">SGBU Showcase</h1>
                        <p className="text-[10px] text-indigo-300 uppercase font-black tracking-[0.2em]">Biblioteca Universitaria Digital</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-4 text-xs font-bold text-slate-400">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                             Portal Estudiante Activo
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                             Panel Bibliotecario Sync
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                        <ExternalLink size={16} /> Ver en vivo
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: Web App */}
                <div className="flex-1 relative flex flex-col border-r border-white/5 bg-[#f8fafc]">
                    <div className="h-10 bg-slate-100 flex items-center px-4 justify-between border-b border-slate-200">
                         <div className="flex items-center gap-2 text-slate-400">
                            <Monitor size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Portal del Estudiante (Desktop)</span>
                         </div>
                         <div className="flex gap-1.5">
                             <div className="w-3 h-3 rounded-full bg-slate-200" />
                             <div className="w-3 h-3 rounded-full bg-slate-200" />
                             <div className="w-3 h-3 rounded-full bg-slate-200" />
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

                {/* Right: Mobile App */}
                <div className="w-[450px] relative bg-slate-900 flex flex-col items-center justify-center p-8 shrink-0 overflow-y-auto hidden lg:flex">
                    <div className="flex items-center gap-2 mb-6 text-indigo-300">
                        <Smartphone size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Vista Bibliotecario</span>
                    </div>

                    {/* Phone Frame */}
                    <div className="relative w-[320px] h-[680px] bg-black rounded-[3rem] shadow-2xl border-[8px] border-slate-800 flex flex-col overflow-hidden ring-4 ring-white/5">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
                            <div className="w-10 h-1 bg-black/20 rounded-full" />
                        </div>
                        
                        <iframe 
                            src={`${baseUrl}?view=app`}
                            className="w-full h-full border-none"
                            title="SGBU Mobile Admin"
                        />

                        {/* Home indicator */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1.5 bg-black/20 rounded-full z-50" />
                    </div>

                    <div className="mt-8 max-w-[280px] text-center">
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            <span className="text-indigo-400 font-bold">Tip:</span> Los cambios que realices en el inventario o préstamos desde aquí se sincronizarán en tiempo real con el catálogo web.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer / Instructions */}
            <div className="h-10 bg-indigo-600 px-8 flex items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-widest shrink-0">
                <span>Demo Interactiva SGBU</span>
                <span className="opacity-50">|</span>
                <span>Desarrollado para Propuesta Universitaria</span>
            </div>
        </div>
    );
}
