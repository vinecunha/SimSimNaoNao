import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, Star } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ 
      password: password 
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Senha definida com sucesso, leva para o dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-8 animate-in fade-in duration-700">
        <div className="bg-black p-2 rounded-xl shadow-[3px_3px_0px_0px_#f97316]">
          <ShieldCheck className="text-orange-500" size={24} />
        </div>
        <span className="font-black text-2xl italic tracking-tighter uppercase text-black">
          SIMSIM<span className="text-orange-500">NAONAO</span>
        </span>
      </div>

      <div className="max-w-md w-full bg-white border-[4px] border-black rounded-[40px] p-10 shadow-[16px_16px_0px_0px_black] animate-in zoom-in duration-300">
        <h2 className="text-3xl font-black uppercase italic mb-2 leading-none">BEM-VINDO(A)!</h2>
        <p className="text-gray-400 font-bold text-[10px] uppercase mb-8 tracking-widest">Defina sua senha de acesso premium</p>

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">Nova Senha</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-[3px] border-black rounded-2xl p-4 pl-12 font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-600 text-[10px] font-black uppercase italic">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl shadow-[0px_8px_0px_0px_#f97316] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 uppercase italic disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'ATIVAR MINHA CONTA'}
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center gap-2 text-gray-300 mt-12">
        <Star size={12} fill="currentColor" />
        <p className="text-[9px] font-black uppercase italic tracking-widest text-center">Proteção Jurídica Ativada © 2026</p>
        <Star size={12} fill="currentColor" />
      </div>
    </div>
  );
}