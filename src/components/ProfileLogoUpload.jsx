import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Camera, Trash2, Plus, User } from 'lucide-react';

export default function ProfileLogoUpload({ perfil, onUploadSuccess, onRemoveLogo }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB");
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `logos_perfis/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('publicSimSimNaoNao')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('publicSimSimNaoNao')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('perfis')
        .update({ logo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      onUploadSuccess(publicUrl);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: updateError } = await supabase
        .from('perfis')
        .update({ logo_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      onRemoveLogo();
    } catch (error) {
      console.error(error);
      alert("Erro ao remover imagem.");
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

      <div 
        onClick={() => !perfil?.logo_url && fileInputRef.current.click()}
        className={`
          relative w-32 h-32 
          rounded-[32px] border-[3px] border-black 
          flex items-center justify-center 
          overflow-hidden transition-all duration-200
          ${!perfil?.logo_url ? 'bg-gray-100 cursor-pointer hover:bg-orange-50 hover:border-orange-500 shadow-[6px_6px_0px_0px_black]' : 'bg-white shadow-[8px_8px_0px_0px_black]'}
        `}
      >
        {perfil?.logo_url ? (
          <div className="relative w-full h-full group">
            <img 
              src={perfil.logo_url} 
              alt="Avatar do Emissor" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                className="bg-white p-2 rounded-xl text-black hover:bg-orange-500 hover:text-white transition-colors border-2 border-black shadow-[2px_2px_0px_0px_black]"
               >
                 <Camera size={18} />
               </button>
               <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                className="bg-white p-2 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-colors border-2 border-black shadow-[2px_2px_0px_0px_black]"
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-orange-500">
            <User size={40} className="mb-1" />
            <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded-md">
                <Plus size={12} />
                <span className="text-[10px] font-black uppercase italic leading-none">Foto</span>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20">
            <Loader2 className="animate-spin text-orange-600" size={32} />
          </div>
        )}
      </div>
    </div>
  );
}