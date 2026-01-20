import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Send, 
  Mail, 
  ArrowRight,
  Loader2,
  FileText
} from 'lucide-react';

export default function SuccessAvulso() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [acordo, setAcordo] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const checkoutId = searchParams.get('session_id');

  useEffect(() => {
    if (checkoutId) {
      fetchAcordo();
    } else {
      setLoading(false);
    }
  }, [checkoutId]);

  const fetchAcordo = async () => {
    try {
      const { data, error } = await supabase
        .from('acordos')
        .select('*')
        .eq('checkout_id', checkoutId)
        .single();

      if (error) throw error;

      if (!data.pago) {
        await supabase.from('acordos').update({ pago: true }).eq('id', data.id);
        // O disparo de e-mail deve ser configurado via Edge Function/Webhook
      }
      
      setAcordo(data);
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const linkAssinatura = `${window.location.origin}/assinar/${acordo?.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(linkAssinatura);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <Loader2 className="animate-spin text-black" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-[3px] border-black rounded-[40px] p-8 shadow-[12px_12px_0px_0px_black] text-center">
        
        {/* ÍCONE DE SUCESSO */}
        <div className="w-20 h-20 bg-[#00FF7F] rounded-3xl border-[3px] border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_black]">
          <CheckCircle2 size={40} strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-black uppercase italic leading-tight mb-2">Contrato Liberado!</h1>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Pagamento Processado com Sucesso</p>

        {/* BOX DO LINK (FOCO PRINCIPAL) */}
        <div className="bg-orange-50 border-[3px] border-black rounded-[24px] p-5 mb-6 text-left relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Send size={14} className="text-orange-600" />
            <span className="text-[10px] font-black uppercase text-orange-600">Link para o Cliente</span>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-3 font-bold text-[11px] truncate shadow-[2px_2px_0px_0px_black]">
              {linkAssinatura}
            </div>
            <button 
              onClick={copyLink}
              className={`p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_black] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${copied ? 'bg-green-400' : 'bg-white hover:bg-orange-100'}`}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* AVISO DE E-MAIL */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-black rounded-2xl mb-8 text-left">
          <div className="p-2 bg-white border-2 border-black rounded-lg">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-gray-400 leading-none mb-1">Cópia enviada para:</p>
            <p className="text-[11px] font-bold truncate max-w-[200px]">{acordo?.emissor_email}</p>
          </div>
        </div>

        {/* CTA FINAL / UPSELL SUTIL */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
          >
            Novo Contrato <ArrowRight size={18} />
          </button>
          
          <p className="text-[9px] font-black text-gray-400 uppercase">
            Quer contratos ilimitados? <span className="text-orange-500 cursor-pointer hover:underline" onClick={() => window.open('LINK_DO_PREMIUM')}>Seja Premium</span>
          </p>
        </div>
      </div>
    </div>
  );
}