import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ImageIcon, Loader2, Camera, Trash2, Plus } from 'lucide-react';

export default function ContractLogoUpload({ acordo, onUploadSuccess, onRemoveLogo }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validação básica de tamanho (ex: 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB");
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${acordo.id}-${Date.now()}.${fileExt}`;
      const filePath = `logos_contratos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('publicSimSimNaoNao')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('publicSimSimNaoNao')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('acordos')
        .update({ emissor_logo: publicUrl })
        .eq('id', acordo.id);

      if (updateError) throw updateError;
      
      onUploadSuccess(acordo.id, publicUrl);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*" 
      />

      {/* Container Principal da Logo */}
      <div 
        onClick={() => !acordo.emissor_logo && fileInputRef.current.click()}
        className={`
          relative w-20 h-20 md:w-24 md:h-24 
          rounded-2xl border-[3px] border-black 
          flex items-center justify-center 
          overflow-hidden transition-all duration-200
          ${!acordo.emissor_logo ? 'bg-gray-100 cursor-pointer hover:bg-orange-50 hover:border-orange-500 shadow-[4px_4px_0px_0px_black]' : 'bg-white shadow-[6px_6px_0px_0px_black]'}
        `}
      >
        {acordo.emissor_logo ? (
          <div className="relative w-full h-full group">
            <img 
              src={acordo.emissor_logo} 
              alt="Logo do Emissor" 
              className="w-full h-full object-contain p-2"
            />
            {/* Overlay de Hover quando já tem logo */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                className="bg-white p-1.5 rounded-lg text-black hover:bg-orange-500 hover:text-white transition-colors"
               >
                 <Camera size={16} />
               </button>
               <button 
                onClick={(e) => { e.stopPropagation(); onRemoveLogo(acordo.id); }}
                className="bg-white p-1.5 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors"
               >
                 <Trash2 size={16} />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-orange-500">
            <Plus size={24} className="mb-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Sua Logo</span>
          </div>
        )}

        {/* Loading State Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20">
            <Loader2 className="animate-spin text-orange-600" size={24} />
          </div>
        )}
      </div>

      {/* Tag de Identificação opcional */}
      <div className="mt-3 flex justify-center">
        <span className="text-[7px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full">
          Identidade Visual
        </span>
      </div>
    </div>
  );
}