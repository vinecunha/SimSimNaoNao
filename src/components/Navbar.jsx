import React, { useState, useEffect } from 'react';
import { Zap, ArrowRight, LayoutDashboard, LogIn, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Identifica a página atual
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="w-full py-4 md:py-6 px-4 md:px-12 flex justify-between items-center max-w-[1440px] mx-auto gap-2">
      {/* Logo */}
      <div 
        className="flex items-center gap-1.5 md:gap-2 shrink-0 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <div className="bg-black p-1 md:p-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(249,115,22,1)]">
          <Zap className="text-orange-500 fill-orange-500 w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-[15px] sm:text-lg md:text-2xl font-black tracking-tighter uppercase leading-none whitespace-nowrap">
          SimSim<span className="text-orange-500">NãoNão</span>
        </span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6 shrink-0">
        {!user ? (
          <>
            <button 
              onClick={() => navigate('/login')}
              className="hidden lg:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-orange-600 transition-colors cursor-pointer outline-none"
            >
              JÁ É DA ELITE? 
              <ArrowRight size={14} strokeWidth={3} />
            </button>
            
            <button 
              onClick={() => navigate('/login')}
              className="bg-black text-white px-3 py-2 md:px-8 md:py-3 rounded-xl font-black hover:bg-orange-600 transition-all shadow-[3px_3px_0px_0px_rgba(249,115,22,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-2"
            >
              <LogIn size={14} />
              <span className="text-[10px] md:text-base uppercase">ÁREA PREMIUM</span>
            </button>
          </>
        ) : (
          /* Se estiver no Dashboard, mostra "Novo Acordo". Se não, mostra "Dashboard" */
          <button 
            onClick={() => navigate(isDashboard ? '/' : '/dashboard')}
            className={`bg-black text-white px-3 py-2 md:px-8 md:py-3 rounded-xl font-black transition-all active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-2 ${
              isDashboard 
                ? 'shadow-[3px_3px_0px_0px_#f97316] hover:bg-orange-600' 
                : 'shadow-[3px_3px_0px_0px_#22c55e] hover:bg-green-600'
            }`}
          >
            {isDashboard ? (
              <>
                <Plus size={14} strokeWidth={3} />
                <span className="text-[10px] md:text-base uppercase">Novo Acordo</span>
              </>
            ) : (
              <>
                <LayoutDashboard size={14} />
                <span className="text-[10px] md:text-base uppercase">Dashboard</span>
              </>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}