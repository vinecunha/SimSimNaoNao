import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileLogoUpload from '../components/ProfileLogoUpload';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [perfil, setPerfil] = useState({
    nome_completo: '',
    documento: '',
    email_comercial: '',
    telefone: '',
    endereco_completo: '',
    logo_url: ''
  });

  const maskDoc = (value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 11) return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4").substring(0, 14);
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5").substring(0, 18);
  };

  const maskPhone = (value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 10) return clean.replace(/(\d{2})(\d{4})(\d{4})/g, "($1) $2-$3").substring(0, 14);
    return clean.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3").substring(0, 15);
  };

  useEffect(() => {
    async function getPerfil() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate('/login'); return; }
        setUserEmail(user.email);
        const { data, error } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setPerfil(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally { setLoading(false); }
    }
    getPerfil();
  }, [navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('perfis').upsert({
        id: user.id,
        nome_completo: perfil.nome_completo,
        documento: perfil.documento,
        email_comercial: perfil.email_comercial,
        telefone: perfil.telefone,
        endereco_completo: perfil.endereco_completo,
        logo_url: perfil.logo_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Perfil atualizado com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      alert("Erro ao salvar: " + error.message);
    } finally { setSaving(false); }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <Loader2 className="animate-spin text-orange-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 text-left">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mb-8 flex items-center gap-2 font-black uppercase text-[10px] hover:text-orange-500 transition-colors"
        >
          <ArrowLeft size={14} /> Voltar ao Painel
        </button>

        <div className="bg-white border-[4px] border-black rounded-[40px] p-10 shadow-[12px_12px_0px_0px_black]">
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b-[3px] border-black pb-10">
            <ProfileLogoUpload 
              perfil={perfil} 
              onUploadSuccess={(url) => setPerfil({...perfil, logo_url: url})}
              onRemoveLogo={() => setPerfil({...perfil, logo_url: ''})}
            />
            
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">
                Dados do Emissor
              </h2>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Configurações de Conta</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase mb-2 ml-2 text-gray-400 flex items-center gap-1.5">
                   <Lock size={10} /> E-mail de Cadastro (Protegido)
                </label>
                <input readOnly className="w-full p-5 bg-gray-100 border-[3px] border-black rounded-2xl font-bold text-gray-500 outline-none cursor-not-allowed opacity-70" value={userEmail} />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase mb-2 ml-2 text-gray-400">Nome Completo ou Razão Social</label>
                <input required placeholder="COMO APARECERÁ NO CONTRATO" className="w-full p-5 bg-gray-50 border-[3px] border-black rounded-2xl font-bold outline-none focus:bg-orange-50 focus:border-orange-500 transition-all uppercase placeholder:text-gray-300" value={perfil.nome_completo} onChange={e => setPerfil({...perfil, nome_completo: e.target.value.toUpperCase()})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2 ml-2 text-gray-400">CPF ou CNPJ</label>
                  <input placeholder="000.000.000-00" className="w-full p-5 bg-gray-50 border-[3px] border-black rounded-2xl font-bold outline-none focus:bg-orange-50 focus:border-orange-500 transition-all" value={perfil.documento} onChange={e => setPerfil({...perfil, documento: maskDoc(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-2 ml-2 text-gray-400">Telefone</label>
                  <input placeholder="(00) 00000-0000" className="w-full p-5 bg-gray-50 border-[3px] border-black rounded-2xl font-bold outline-none focus:bg-orange-50 focus:border-orange-500 transition-all" value={perfil.telefone} onChange={e => setPerfil({...perfil, telefone: maskPhone(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-2 ml-2 text-gray-400">Endereço Comercial Completo</label>
                <input placeholder="RUA, NÚMERO, CIDADE - UF" className="w-full p-5 bg-gray-50 border-[3px] border-black rounded-2xl font-bold outline-none focus:bg-orange-50 focus:border-orange-500 transition-all uppercase placeholder:text-gray-300" value={perfil.endereco_completo} onChange={e => setPerfil({...perfil, endereco_completo: e.target.value.toUpperCase()})} />
              </div>
            </div>

            <button type="submit" disabled={saving} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase italic text-xl shadow-[0px_6px_0px_0px_#f97316] hover:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
              {saving ? 'SALVANDO...' : 'ATUALIZAR PERFIL'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}