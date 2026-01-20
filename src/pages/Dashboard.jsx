import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generatePDF } from '../utils/pdfGenerator';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardHeader from '../components/DashboardHeader';
import ContractCard from '../components/ContractCard';

export default function Dashboard() {
  const [acordos, setAcordos] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const navigate = useNavigate();

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

  const copyLink = (id) => {
    const link = `${window.location.origin}/assinar/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusStyle = (acordo) => {
    const trintaDias = 30 * 24 * 60 * 60 * 1000;
    const expirado = (new Date() - new Date(acordo.created_at)) > trintaDias && !acordo.assinado_em;
    if (acordo.assinado_em) return { text: 'text-green-600', bg: 'bg-green-50', label: 'Assinado' };
    if (expirado) return { text: 'text-red-600', bg: 'bg-red-50', label: 'Expirado' };
    return { text: 'text-orange-600', bg: 'bg-orange-50', label: 'Pendente' };
  };

  // Lógica de Ordenação: Pendentes primeiro, depois por data decrescente
  const sortedAcordos = [...acordos].sort((a, b) => {
    const statusA = getStatusStyle(a).label;
    const statusB = getStatusStyle(b).label;

    if (statusA === 'Pendente' && statusB !== 'Pendente') return -1;
    if (statusA !== 'Pendente' && statusB === 'Pendente') return 1;

    return new Date(b.created_at) - new Date(a.created_at);
  });

  const filteredAcordos = sortedAcordos.filter(a => 
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
        <DashboardHeader 
          perfil={perfil} 
          onNavigate={navigate} 
          onLogout={async () => { await supabase.auth.signOut(); navigate('/', { replace: true }); }} 
        />

        {/* BUSCA E FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="PESQUISAR CLIENTE OU SERVIÇO..." 
              className="pl-12 pr-6 py-4 bg-white border-[3px] border-black rounded-xl outline-none font-bold text-[12px] w-full shadow-[4px_4px_0px_0px_black] focus:shadow-orange-500 transition-all uppercase" 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-[3px] border-black rounded-xl px-4 shadow-[4px_4px_0px_0px_black]">
            <span className="text-[10px] font-black text-gray-400 uppercase">Ver:</span>
            {[12, 24].map((num) => (
              <button 
                key={num} 
                onClick={() => { setItemsPerPage(num); setCurrentPage(1); }} 
                className={`px-3 py-1 font-black text-[11px] rounded ${itemsPerPage === num ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((acordo) => (
            <ContractCard 
              key={acordo.id}
              acordo={acordo}
              status={getStatusStyle(acordo)}
              onCopy={copyLink}
              isCopied={copiedId === acordo.id}
              onDownload={generatePDF}
              onUpdateLogo={handleUpdateLogoState}
              onRemoveLogo={handleRemoveLogo}
            />
          ))}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button 
              onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0,0); }} 
              disabled={currentPage === 1}
              className="p-3 border-[3px] border-black rounded-xl disabled:opacity-30 bg-white shadow-[3px_3px_0px_0px_black] transition-all active:shadow-none active:translate-y-0.5"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-black text-xs uppercase italic bg-white border-[3px] border-black px-5 py-2 rounded-xl shadow-[3px_3px_0px_0px_black]">
              Página {currentPage} de {totalPages}
            </div>
            <button 
              onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0,0); }} 
              disabled={currentPage === totalPages}
              className="p-3 border-[3px] border-black rounded-xl disabled:opacity-30 bg-white shadow-[3px_3px_0px_0px_black] transition-all active:shadow-none active:translate-y-0.5"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}