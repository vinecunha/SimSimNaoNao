import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { generatePDF } from '../utils/pdfGenerator';
import { 
  ExternalLink, Download, Clock, CheckCircle, AlertCircle, 
  Copy, Check, Search, UserCircle, Settings, LogOut, 
  ChevronLeft, ChevronRight, Calendar, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ContractLogoUpload from '../components/ContractLogoUpload';

export default function Dashboard() {
  const [acordos, setAcordos] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  const fetchDadosIniciais = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: perfilData } = await supabase.from('perfis').select('*').eq('id', user.id).single();
      setPerfil(perfilData);
      const { data: acordosData, error } = await supabase.from('acordos').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (!error) setAcordos(acordosData);
    } else {
      navigate('/login');
    }
    setLoading(false);
  };

  const handleUpdateLogoState = (id, url) => {
    setAcordos(prev => prev.map(a => a.id === id ? { ...a, emissor_logo: url } : a));
  };

  const handleRemoveLogo = async (id) => {
    if (!window.confirm("Remover a logomarca?")) return;
    const { error } = await supabase.from('acordos').update({ emissor_logo: null }).eq('id', id);
    if (!error) handleUpdateLogoState(id, null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  const copyLink = (id) => {
    const link = `${window.location.origin}/assinar/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusStyle = (acordo) => {
    const trintaDias = 30 * 24 * 60 * 60 * 1000;
    const expirado = (new Date() - new Date(acordo.created_at)) > trintaDias && !acordo.assinado_em;
    
    if (acordo.assinado_em) return {
      border: 'border-green-500',
      shadow: 'shadow-[6px_6px_0px_0px_rgba(34,197,94,0.2)]',
      text: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Assinado'
    };
    if (expirado) return {
      border: 'border-red-500',
      shadow: 'shadow-[6px_6px_0px_0px_rgba(239,68,68,0.2)]',
      text: 'text-red-600',
      bg: 'bg-red-50',
      label: 'Expirado'
    };
    return {
      border: 'border-orange-500',
      shadow: 'shadow-[6px_6px_0px_0px_rgba(249,115,22,0.2)]',
      text: 'text-orange-600',
      bg: 'bg-orange-50',
      label: 'Pendente'
    };
  };

  const filteredAcordos = acordos.filter(a => 
    (a.cliente_nome?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (a.servico?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAcordos.length / itemsPerPage);
  const currentItems = filteredAcordos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] font-black italic uppercase">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-left text-black pb-20 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* HEADER LIMPO E PROFISSIONAL */}
        <div className="bg-white border-[3px] border-black rounded-[24px] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_black]">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 bg-gray-50 border-[3px] border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_black] shrink-0">
              <UserCircle size={36} />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contratos Ativos</p>
              <h3 className="text-xl md:text-3xl font-black uppercase italic leading-none truncate">{perfil?.nome_completo || 'Minhas Empresas'}</h3>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => navigate('/perfil')} className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-white border-[3px] border-black rounded-xl font-black text-[11px] uppercase shadow-[3px_3px_0px_0px_black] hover:bg-gray-50 transition-all active:translate-y-0.5 active:shadow-none"><Settings size={14} /> Perfil</button>
            <button onClick={handleLogout} className="p-3 text-red-600 border-[3px] border-transparent hover:border-red-100 rounded-xl transition-all"><LogOut size={22} /></button>
          </div>
        </div>

        {/* BUSCA COM FOCO EM UX */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="PESQUISAR CLIENTE OU SERVIÇO..." 
              className="pl-12 pr-6 py-4 bg-white border-[3px] border-black rounded-xl outline-none font-bold text-[12px] w-full shadow-[4px_4px_0px_0px_black] focus:shadow-orange-500 transition-all" 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-[3px] border-black rounded-xl px-4 shadow-[4px_4px_0px_0px_black]">
            <span className="text-[10px] font-black text-gray-400 uppercase">Ver:</span>
            {[12, 24].map((num) => (
              <button key={num} onClick={() => { setItemsPerPage(num); setCurrentPage(1); }} className={`px-3 py-1 font-black text-[11px] rounded ${itemsPerPage === num ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>{num}</button>
            ))}
          </div>
        </div>

        {/* GRID DE CARDS EQUILIBRADO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((acordo) => {
            const status = getStatusStyle(acordo);
            return (
              <div key={acordo.id} className={`group bg-white border-[3px] border-black rounded-[24px] p-5 flex flex-col shadow-[6px_6px_0px_0px_black] hover:translate-y-[-4px] transition-all duration-300 relative`}>
                
                {/* Indicador sutil de status (Borda colorida) */}
                <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-lg border-2 border-black ${status.bg} ${status.text}`}>
                  <span className="text-[8px] font-black uppercase italic tracking-tighter">{status.label}</span>
                </div>

                <div className="mb-6">
                  <ContractLogoUpload acordo={acordo} onUploadSuccess={handleUpdateLogoState} onRemoveLogo={handleRemoveLogo} />
                </div>

                <div className="flex-1 mb-6 text-left">
                  <h4 className="font-black uppercase text-base leading-tight mb-1 truncate group-hover:text-orange-600 transition-colors">
                    {acordo.cliente_nome || 'Cliente não identificado'}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase italic truncate">{acordo.servico}</p>
                </div>

                {/* Info Box - Cinza Sóbrio */}
                <div className="grid grid-cols-2 border-2 border-black rounded-xl mb-6 divide-x-2 divide-black bg-gray-50 overflow-hidden">
                  <div className="p-2 flex items-center gap-2">
                    <DollarSign size={14} className="text-gray-400" />
                    <p className="font-black text-[10px] italic truncate">{acordo.valor}</p>
                  </div>
                  <div className="p-2 flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <p className="font-black text-[10px] italic truncate">{new Date(acordo.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {/* Botões - Apenas o Copy ganha cor ao interagir */}
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => copyLink(acordo.id)} 
                    className={`flex items-center justify-center py-3 rounded-xl border-[3px] border-black shadow-[2px_2px_0px_0px_black] active:shadow-none transition-all ${copiedId === acordo.id ? 'bg-green-500 text-white' : 'bg-white hover:bg-orange-50'}`}
                  >
                    {copiedId === acordo.id ? <Check size={18}/> : <Copy size={18}/>}
                  </button>
                  <button 
                    onClick={() => generatePDF(acordo)} 
                    className="flex items-center justify-center py-3 bg-black text-white rounded-xl border-[3px] border-black shadow-[2px_2px_0px_0px_black] hover:bg-gray-800 active:shadow-none transition-all"
                  >
                    <Download size={18} />
                  </button>
                  <a 
                    href={`/assinar/${acordo.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center py-3 bg-white border-[3px] border-black rounded-xl shadow-[2px_2px_0px_0px_black] hover:bg-gray-50 active:shadow-none transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button 
              onClick={() => { paginate(currentPage - 1); window.scrollTo(0,0); }} 
              disabled={currentPage === 1}
              className="p-3 border-[3px] border-black rounded-xl disabled:opacity-30 bg-white shadow-[3px_3px_0px_0px_black] transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-black text-xs uppercase italic bg-white border-[3px] border-black px-5 py-2 rounded-xl shadow-[3px_3px_0px_0px_black]">
              Página {currentPage} de {totalPages}
            </div>
            <button 
              onClick={() => { paginate(currentPage + 1); window.scrollTo(0,0); }} 
              disabled={currentPage === totalPages}
              className="p-3 border-[3px] border-black rounded-xl disabled:opacity-30 bg-white shadow-[3px_3px_0px_0px_black] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}