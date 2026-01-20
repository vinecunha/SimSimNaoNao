import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="flex flex-col gap-4 md:gap-6 text-left relative z-0">
      <div className="inline-flex items-center gap-2 bg-orange-100 border-2 border-black px-4 py-1 rounded-full text-black text-[10px] font-black uppercase tracking-widest w-fit">
        <Star size={12} className="fill-orange-500" />
        <span>Freelancers de elite • 2026</span>
      </div>
      
      <div className="flex flex-col">
        <h2 className="text-[clamp(2.5rem,6vw,4.2rem)] font-black leading-[0.85] tracking-tighter uppercase text-black">
          PARE DE PAGAR
        </h2>
        <h2 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.85] tracking-tighter uppercase italic text-orange-500">
          MENSALIDADE.
        </h2>
      </div>

      <div className="space-y-4">
        <p className="text-base md:text-xl text-gray-600 font-bold max-w-[440px] leading-tight">
          Crie acordos irrefutáveis. Pague uma vez, use para sempre. O fim da fadiga de assinaturas.
        </p>
        
        <div className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-fit">
          <div className="flex items-center gap-3 text-black font-black uppercase text-xs tracking-wider">
            <ShieldCheck size={20} className="text-orange-500" strokeWidth={3} />
            <span>Acordo com validade jurídica em todo o Brasil</span>
          </div>
        </div>
      </div>
    </section>
  );
}