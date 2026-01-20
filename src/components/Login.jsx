import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Tenta autenticar
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      alert("Erro ao entrar: " + authError.message);
      setLoading(false);
      return;
    }

    // 2. Verifica se o perfil é Premium/Ativo
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('status_assinatura, tipo_plano, expiracao_em')
      .eq('id', authData.user.id)
      .single();

    const isAtivo = perfil?.status_assinatura === 'ativo' || perfil?.tipo_plano === 'vitalicio';
    const isExpirado = perfil?.expiracao_em && new Date(perfil.expiracao_em) < new Date();

    if (!isAtivo || isExpirado) {
      // 3. BARRA O ACESSO: Faz logout se não for premium
      await supabase.auth.signOut();
      alert("ACESSO NEGADO: Sua assinatura não está ativa ou você não possui um plano Premium.");
      setLoading(false);
      return;
    }

    // 4. Se chegou aqui, está liberado
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="bg-white border-[4px] border-black rounded-[32px] p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-center mb-6 text-orange-500">
            <ShieldCheck size={48} strokeWidth={3} />
          </div>
          
          <h2 className="text-3xl font-black uppercase italic text-center mb-8 italic">
            ÁREA PREMIUM
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="email"
                placeholder="SEU E-MAIL"
                className="w-full p-4 pl-12 bg-gray-50 border-[3px] border-black rounded-2xl outline-none font-bold focus:bg-orange-50 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                required
                type="password"
                placeholder="SUA SENHA"
                className="w-full p-4 pl-12 bg-gray-50 border-[3px] border-black rounded-2xl outline-none font-bold focus:bg-orange-50 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-xl shadow-[0px_6px_0px_0px_#f97316] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 uppercase italic disabled:opacity-50"
            >
              {loading ? 'ENTRANDO...' : 'ACESSAR PAINEL'} <ArrowRight strokeWidth={4} />
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Acesso exclusivo para membros vitalícios
          </p>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full mt-8 font-black uppercase text-xs hover:text-orange-500 transition-colors"
        >
          ← Voltar para a Home
        </button>
      </div>
    </div>
  );
}