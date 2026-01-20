import jsPDF from 'jspdf';

export const generatePDF = async (acordo) => {
  const doc = new jsPDF();
  const margin = 25;
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  
  const dados = {
    id: acordo.id,
    servico: acordo.servico,
    valor: acordo.valor,
    prazo: acordo.prazo,
    penalidade: acordo.penalidade || acordo.nao,
    emissorNome: acordo.emissor_nome || acordo.nomeContratante,
    emissorDoc: acordo.emissor_doc || acordo.docContratante,
    emissorEnd: acordo.emissor_endereco || acordo.enderecoContratante,
    emissorLogo: acordo.emissor_logo || null,
    clienteNome: acordo.cliente_nome || acordo.nomeCliente,
    clienteDoc: acordo.cliente_doc || acordo.docCliente,
    clienteEnd: acordo.cliente_endereco || acordo.enderecoCliente,
    assinaturaIP: acordo.assinatura_ip,
    assinadoEm: acordo.assinado_em
  };

  const isAssinado = !!dados.assinadoEm;
  const toUp = (text) => text ? String(text).toUpperCase() : "---";
  const authID = dados.id.substring(0, 8).toUpperCase();

  // --- FUNÇÃO PARA CARREGAR E INSERIR LOGOS ---
  const addLogos = async () => {
    if (dados.emissorLogo) {
      try {
        const img = new Image();
        img.src = dados.emissorLogo;
        img.crossOrigin = "Anonymous"; 
        await new Promise((resolve, reject) => { 
          img.onload = resolve; 
          img.onerror = reject;
        });

        // 1. LOGO NO CABEÇALHO (Topo Esquerdo - Estilo Word)
        // Posicionada em Y=10 para não interferir no título que começa em Y=25
        doc.addImage(img, 'PNG', margin, 10, 20, 20, undefined, 'FAST');

        // 2. LOGO NO RODAPÉ (Canto Direito - Inline com a assinatura)
        // Posicionada exatamente na altura onde começa o texto da assinatura (footerY + 5)
        doc.addImage(img, 'PNG', width - margin - 20, 267, 20, 20, undefined, 'FAST');

        // 3. MARCA D'ÁGUA CENTRALIZADA
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.1 }));
        const logoSize = 100;
        doc.addImage(img, 'PNG', (width - logoSize) / 2, (height - logoSize) / 2, logoSize, logoSize, undefined, 'FAST');
        doc.restoreGraphicsState();
      } catch (e) {
        console.error("Erro ao carregar logomarca:", e);
      }
    }
  };

  if (dados.emissorLogo) {
    await addLogos();
  }

  // --- CONSTRUÇÃO DO TEXTO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(0);
  // Título centralizado - a logo em Y=10 não afeta este texto em Y=25
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", width / 2, 25, { align: "center" });
  
  doc.setFontSize(10);
  doc.text("1. AS PARTES", margin, 40);

  doc.setFont("helvetica", "normal");
  const emissorInfo = `CONTRATADO(A): ${toUp(dados.emissorNome)}, INSCRITO(A) NO DOCUMENTO SOB Nº ${toUp(dados.emissorDoc)}, RESIDENTE OU SEDIADO(A) EM ${toUp(dados.emissorEnd)}.`;
  const clienteInfo = `CONTRATANTE: ${toUp(dados.clienteNome)}, INSCRITO(A) NO DOCUMENTO SOB Nº ${toUp(dados.clienteDoc)}, RESIDENTE OU SEDIADO(A) EM ${toUp(dados.clienteEnd)}.`;

  const emissorSplit = doc.splitTextToSize(emissorInfo, width - (margin * 2));
  doc.text(emissorSplit, margin, 48);
  
  const clienteY = 48 + (emissorSplit.length * 5) + 2;
  const clienteSplit = doc.splitTextToSize(clienteInfo, width - (margin * 2));
  doc.text(clienteSplit, margin, clienteY);

  let currentY = clienteY + (clienteSplit.length * 5) + 10;

  doc.setFont("helvetica", "bold");
  doc.text("2. CLÁUSULA PRIMEIRA - DO OBJETO E VALOR", margin, currentY);
  doc.setFont("helvetica", "normal");
  currentY += 7;
  const objTexto = `O PRESENTE CONTRATO TEM COMO OBJETO A PRESTAÇÃO DE SERVIÇO DE: ${toUp(dados.servico)}. PELO CUMPRIMENTO DO OBJETO, O CONTRATANTE PAGARÁ O VALOR DE ${toUp(dados.valor)}, COM PRAZO DE ENTREGA/CONCLUSÃO DEFINIDO PARA ${toUp(dados.prazo)}.`;
  const objSplit = doc.splitTextToSize(objTexto, width - (margin * 2));
  doc.text(objSplit, margin, currentY);

  currentY += (objSplit.length * 5) + 7;

  doc.setFont("helvetica", "bold");
  doc.text("3. CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES", margin, currentY);
  doc.setFont("helvetica", "normal");
  currentY += 7;
  const obrigaTexto = `O CONTRATADO COMPROMETE-SE A REALIZAR O SERVIÇO COM ZELO E DENTRO DO PRAZO. O CONTRANTE COMPROMETE-SE A FORNECER AS INFORMAÇÕES NECESSÁRIAS E EFETUAR O PAGAMENTO CONFORME PACTUADO.`;
  const obrigaSplit = doc.splitTextToSize(obrigaTexto, width - (margin * 2));
  doc.text(obrigaSplit, margin, currentY);

  currentY += (obrigaSplit.length * 5) + 7;

  doc.setFont("helvetica", "bold");
  doc.text("4. CLÁUSULA TERCEIRA - DAS PENALIDADES E RESCISÃO", margin, currentY);
  doc.setFont("helvetica", "normal");
  currentY += 7;
  const penalTexto = `EM CASO DE DESCUMPRIMENTO OU DESISTÊNCIA SEM JUSTA CAUSA, APLICA-SE A SEGUINTE PENALIDADE: ${toUp(dados.penalidade)}. O CONTRATO PODERÁ SER RESCINDIDO MEDIANTE AVISO PRÉVIO CASO HAJA INVIABILIDADE TÉCNICA OU FALTA DE PAGAMENTO.`;
  const penalSplit = doc.splitTextToSize(penalTexto, width - (margin * 2));
  doc.text(penalSplit, margin, currentY);

  currentY += (penalSplit.length * 5) + 7;

  doc.setFont("helvetica", "bold");
  doc.text("5. CLÁUSULA QUARTA - DO FORO", margin, currentY);
  doc.setFont("helvetica", "normal");
  currentY += 7;
  const foroTexto = `PARA DIRIMIR QUAISQUER CONTROVÉRSIAS ORIUNDAS DESTE INSTRUMENTO, AS PARTES ELEGEM O FORO DA COMARCA DO CONTRATADO, COM RENÚNCIA EXPRESSA A QUALQUER OUTRO, POR MAIS PRIVILEGIADO QUE SEJA.`;
  const foroSplit = doc.splitTextToSize(foroTexto, width - (margin * 2));
  doc.text(foroSplit, margin, currentY);

  // --- RODAPÉ ---
  const footerY = 265;
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY, width - margin, footerY);
  
  doc.setFontSize(8);
  if (isAssinado) {
    const dataAssinatura = new Date(dados.assinadoEm).toLocaleString('pt-BR');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0); 
    // Texto de assinatura
    doc.text(`ASSINADO DIGITALMENTE EM: ${dataAssinatura}`, margin, footerY + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`IP DE ORIGEM: ${dados.assinaturaIP} | ID: ${dados.id.toUpperCase()}`, margin, footerY + 12);
    doc.text("ESTE DOCUMENTO POSSUI VALIDADE JURÍDICA CONFORME A MP Nº 2.200-2/2001.", margin, footerY + 17);
  } else {
    doc.setTextColor(200, 0, 0);
    doc.text("DOCUMENTO PENDENTE DE ASSINATURA DIGITAL", margin, footerY + 7);
  }

  doc.save(`CONTRATO-${authID}.pdf`);
  return true;
};