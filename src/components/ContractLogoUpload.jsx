import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, Loader2, Camera, Trash2 } from 'lucide-react';

export default function ContractLogoUpload({ acordo, onUploadSuccess, onRemoveLogo }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group shrink-0">
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl border-[3px] border-black flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_black] group-hover:border-orange-500 transition-colors">
        {acordo.emissor_logo ? (
          <img src={acordo.emissor_logo} alt="Logo" className="w-full h-full object-contain p-1" />
        ) : (
          <ImageIcon className="text-gray-200" size={32} />
        )}
      </div>
      
      <div className="absolute -top-2 -right-2 flex flex-col gap-1">
        <button 
          onClick={() => fileInputRef.current.click()}
          className="bg-black text-white p-2 rounded-lg border-2 border-white shadow-lg hover:bg-orange-500 transition-all active:scale-90"
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
        </button>
        {acordo.emissor_logo && (
          <button 
            onClick={() => onRemoveLogo(acordo.id)}
            className="bg-white text-red-600 p-2 rounded-lg border-2 border-red-600 shadow-lg hover:bg-red-50 transition-all active:scale-90"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}