import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, PenTool, CheckCircle2, FileText, Loader2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generatePDF } from '../utils/pdfGenerator';
import ContractCanvas from './ContractCanvas';

export default function SignatureScreen() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [acordo, setAcordo] = useState(null);
  const [expired, setExpired] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    cliente_nome: '',
    cliente_doc: '',
    cliente_tel: '',
    cliente_email: '',
    cliente_endereco: ''
  });

  const [formOk, setFormOk] = useState(false);

  useEffect(() => {
    fetchAcordo();
  }, [id]);

  // Monitora mudanças no formulário para validar em tempo real
  useEffect(() => {
    const valid = 
      (formData.cliente_nome?.trim()?.length || 0) > 5 && 
      (formData.cliente_doc?.trim()?.length || 0) >= 11 && 
      (formData.cliente_email?.includes('@')) &&
      (formData.cliente_tel?.trim()?.length || 0) >= 10 &&
      (formData.cliente_endereco?.trim()?.length || 0) > 10;
    
    setFormOk(valid);
  }, [formData]);

  const fetchAcordo = async () => {
    const { data, error } = await supabase.from('acordos').select('*').eq('id', id).single();
    if (error || !data) return;

    const diff = (new Date() - new Date(data.created_at)) / (1000 * 60 * 60 * 24);
    if (diff > 30 && !data.assinado_em) setExpired(true);

    setAcordo(data);
    setFormData({
      cliente_nome: data.cliente_nome || '',
      cliente_doc: data.cliente_doc || '',
      cliente_tel: data.cliente_tel || '',
      cliente_email: data.cliente_email || '',
      cliente_endereco: data.cliente_endereco || ''
    });

    if (data.assinado_em) setShowSuccess(true);
    setLoading(false);
  };

  const handleAssinar = async (e) => {
    if (e) e.preventDefault();
    if (!formOk || signing) return;

    setSigning(true);
    let ip = 'IP_RESTRITO';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const dataIp = await response.json();
      ip = dataIp.ip;
    } catch (err) { console.error(err); }

    const payload = {
      cliente_nome: formData.cliente_nome.toUpperCase(),
      cliente_doc: formData.cliente_doc.toUpperCase(),
      cliente_tel: formData.cliente_tel,
      cliente_email: formData.cliente_email.toLowerCase(),
      cliente_endereco: formData.cliente_endereco.toUpperCase(),
      assinado_em: new Date().toISOString(),
      assinatura_ip: ip,
      status: 'assinado'
    };

    const { data: atualizado, error } = await supabase
      .from('acordos')
      .update(payload)
      .eq('id', id)
      .select().single();

    if (!error) {
      setAcordo(atualizado);
      setShowSuccess(true);
    } else {
      alert("ERRO AO PROCESSAR ASSINATURA.");
    }
    setSigning(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase italic text-black">CARREGANDO...</div>;
  if (expired) return <div className="min-h-screen flex items-center justify-center font-black text-red-600 uppercase italic">LINK EXPIRADO</div>;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#22c55e] flex items-center justify-center p-6 text-left">
        <div className="max-w-md w-full bg-white border-[4px] border-black rounded-[40px] p-10 shadow-[16px_16px_0px_0px_black] text-center">
          <CheckCircle2 size={80} className="text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-black uppercase italic mb-2 text-black">ASSINADO!</h2>
          <p className="font-bold text-gray-400 uppercase text-[11px] mb-8">O DOCUMENTO FOI REGISTRADO E ESTÁ DISPONÍVEL.</p>
          <button 
            onClick={() => generatePDF(acordo)}
            className="w-full bg-black text-white p-6 rounded-2xl font-black text-xl uppercase flex items-center justify-center gap-3 shadow-[0px_6px_0px_0px_#16a34a] hover:translate-y-1 hover:shadow-none transition-all italic"
          >
            BAIXAR MINHA VIA <Download size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-6 text-left">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 items-start">
        <div className="sticky top-12 scale-95 origin-top hidden lg:block">
          <ContractCanvas dados={{...acordo, ...formData}} />
        </div>

        <div className="bg-white border-[4px] border-black rounded-[32px] p-8 shadow-[16px_16px_0px_0px_black]">
          <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3 text-black">
            DADOS DO CLIENTE <PenTool className="text-orange-500" />
          </h3>

          <form onSubmit={handleAssinar} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Nome Completo</label>
              <input className="w-full p-4 bg-gray-50 border-[3px] border-black rounded-xl font-bold uppercase text-black" placeholder="NOME DO CLIENTE" value={formData.cliente_nome} onChange={(e) => setFormData({...formData, cliente_nome: e.target.value.toUpperCase()})} />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">CPF ou CNPJ</label>
              <input className="w-full p-4 bg-gray-50 border-[3px] border-black rounded-xl font-bold uppercase text-black" placeholder="000.000.000-00" value={formData.cliente_doc} onChange={(e) => setFormData({...formData, cliente_doc: e.target.value.toUpperCase()})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">WhatsApp</label>
                <input className="w-full p-4 bg-gray-50 border-[3px] border-black rounded-xl font-bold text-black" placeholder="(00) 00000-0000" value={formData.cliente_tel} onChange={(e) => setFormData({...formData, cliente_tel: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">E-mail</label>
                <input type="email" className="w-full p-4 bg-gray-50 border-[3px] border-black rounded-xl font-bold uppercase text-black" placeholder="CLIENTE@EMAIL.COM" value={formData.cliente_email} onChange={(e) => setFormData({...formData, cliente_email: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Endereço</label>
              <textarea className="w-full p-4 bg-gray-50 border-[3px] border-black rounded-xl font-bold uppercase h-24 text-black" placeholder="ENDEREÇO COMPLETO" value={formData.cliente_endereco} onChange={(e) => setFormData({...formData, cliente_endereco: e.target.value.toUpperCase()})} />
            </div>

            <button 
              type="submit" 
              disabled={!formOk || signing}
              style={{
                backgroundColor: !formOk || signing ? '#e5e7eb' : '#000000',
                color: !formOk || signing ? '#9ca3af' : '#ffffff',
                cursor: !formOk || signing ? 'not-allowed' : 'pointer',
                boxShadow: !formOk || signing ? 'none' : '0px 8px 0px 0px #f97316',
                pointerEvents: !formOk || signing ? 'none' : 'auto'
              }}
              className="w-full py-6 rounded-2xl font-black text-2xl uppercase italic flex items-center justify-center gap-3 transition-all"
            >
              {signing ? <Loader2 className="animate-spin" /> : <>ASSINAR CONTRATO <ShieldCheck /></>}
            </button>
            
            {!formOk && (
              <p className="text-[9px] font-black text-center uppercase text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                Preencha todos os campos corretamente para assinar.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}