import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { generatePDF } from '../utils/pdfGenerator';
import { 
  ExternalLink, Download, Clock, CheckCircle, AlertCircle, 
  Copy, Check, Search, Plus, UserCircle, Settings, LogOut, 
  ChevronLeft, ChevronRight 
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

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const getStatusBadge = (acordo) => {
    const trintaDias = 30 * 24 * 60 * 60 * 1000;
    const expirado = (new Date() - new Date(acordo.created_at)) > trintaDias && !acordo.assinado_em;
    if (acordo.assinado_em) return <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1"><CheckCircle size={10} /> Assinado</span>;
    if (expirado) return <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1"><AlertCircle size={10} /> Expirado</span>;
    return <span className="text-[9px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1"><Clock size={10} /> Pendente</span>;
  };

  // Lógica de Filtro e Paginação
  const filteredAcordos = acordos.filter(a => 
    (a.cliente_nome?.toLowerCase() || '').includes(filter.toLowerCase()) ||
    (a.servico?.toLowerCase() || '').includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAcordos.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAcordos.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] font-black italic uppercase">Carregando Painel...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-left text-black">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* HEADER ADMINISTRATIVO */}
        <div className="bg-white border-[3px] border-black rounded-[32px] p-5 md:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_0px_black]">
          <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl border-[3px] border-black flex items-center justify-center text-orange-600 shadow-[3px_3px_0px_0px_black] shrink-0">
              <UserCircle size={32} className="md:w-10 md:h-10" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Administrador</p>
              <h3 className="text-lg md:text-2xl font-black uppercase italic leading-none truncate">{perfil?.nome_completo || 'Minhas Empresas'}</h3>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={() => navigate('/perfil')} className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 border-[3px] border-black rounded-xl font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_black] transition-all"><Settings size={14} /> Perfil</button>
            <button onClick={handleLogout} className="p-3 text-red-600 border-[3px] border-transparent hover:border-red-200 rounded-xl transition-all"><LogOut size={20} /></button>
          </div>
        </div>

        {/* BUSCA E SELETOR DE PÁGINAS */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="FILTRAR CONTRATOS..." 
              className="pl-12 pr-6 py-4 bg-white border-[3px] border-black rounded-2xl outline-none font-bold text-[10px] w-full shadow-[4px_4px_0px_0px_black]" 
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }} 
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-[3px] border-black rounded-2xl px-4 py-2 shadow-[4px_4px_0px_0px_black]">
            <span className="text-[9px] font-black uppercase text-gray-400">Ver:</span>
            {[10, 20, 50].map((num) => (
              <button
                key={num}
                onClick={() => { setItemsPerPage(num); setCurrentPage(1); }}
                className={`text-[10px] font-black px-2 py-1 rounded ${itemsPerPage === num ? 'bg-black text-white' : 'text-black hover:bg-gray-100'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid gap-4">
          {currentItems.map((acordo) => (
            <div key={acordo.id} className="bg-white border-[3px] border-black rounded-[24px] p-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4 w-full lg:w-1/3">
                <ContractLogoUpload acordo={acordo} onUploadSuccess={handleUpdateLogoState} onRemoveLogo={handleRemoveLogo} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-black uppercase text-sm truncate">{acordo.cliente_nome || 'Sem Nome'}</p>
                    {getStatusBadge(acordo)}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase truncate">{acordo.servico}</p>
                </div>
              </div>

              <div className="flex justify-between lg:justify-center items-center gap-8 w-full lg:w-1/3 border-y lg:border-y-0 lg:border-x border-dashed border-gray-200 py-3 lg:py-0 px-4">
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-400 uppercase">Valor</p>
                  <p className="font-black text-xs italic">{acordo.valor}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-400 uppercase">Data</p>
                  <p className="font-black text-xs italic">{new Date(acordo.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto">
                <button onClick={() => copyLink(acordo.id)} className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border-[3px] border-black font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_black] transition-all ${copiedId === acordo.id ? 'bg-green-500 text-white' : 'bg-white'}`}>
                  {copiedId === acordo.id ? <Check size={14}/> : <Copy size={14}/>} Link
                </button>
                <button onClick={() => generatePDF(acordo)} className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-black text-white rounded-xl border-[3px] border-black font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_black] transition-all hover:bg-orange-600">
                  <Download size={14} /> PDF
                </button>
                <a href={`/assinar/${acordo.id}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 border-[3px] border-black rounded-xl shadow-[2px_2px_0px_0px_black]"><ExternalLink size={16} /></a>
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLES DE PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="p-2 border-[3px] border-black rounded-xl disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-[2px_2px_0px_0px_black] active:translate-y-0.5 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-sm uppercase italic">Página {currentPage} de {totalPages}</span>
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="p-2 border-[3px] border-black rounded-xl disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-[2px_2px_0px_0px_black] active:translate-y-0.5 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}