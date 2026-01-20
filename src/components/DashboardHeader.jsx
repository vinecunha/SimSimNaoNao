import React from 'react';
import { UserCircle, Settings, LogOut, Camera } from 'lucide-react';

export default function DashboardHeader({ perfil, onNavigate, onLogout }) {
  return (
    <div className="bg-white border-[3px] border-black rounded-[24px] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_black]">
      <div className="flex items-center gap-5 w-full md:w-auto">
        {/* Container da Foto de Perfil - Ajustado para logo_url */}
        <div className="w-16 h-16 bg-gray-50 border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_black] shrink-0 overflow-hidden relative group">
          {perfil?.logo_url ? (
            <img 
              src={perfil.logo_url} 
              alt={perfil.nome_completo} 
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle size={36} className="text-gray-300" />
          )}
          
          <button 
            onClick={() => onNavigate('/perfil')}
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera size={20} className="text-white" />
          </button>
        </div>

        <div className="min-w-0 text-left">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Painel do Emissor</p>
          <h3 className="text-xl md:text-3xl font-black uppercase italic leading-none truncate">
            {perfil?.nome_completo || 'Minha Conta'}
          </h3>
        </div>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <button 
          onClick={() => onNavigate('/perfil')} 
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-white border-[3px] border-black rounded-xl font-black text-[11px] uppercase shadow-[3px_3px_0px_0px_black] hover:bg-gray-50 transition-all active:translate-y-0.5 active:shadow-none"
        >
          <Settings size={14} /> Perfil
        </button>
        <button 
          onClick={onLogout} 
          className="flex items-center justify-center p-3 text-red-600 bg-white border-[3px] border-black rounded-xl shadow-[3px_3px_0px_0px_#fee2e2] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          title="Sair"
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
}