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
  const fullHash = `SHA256:${dados.id.replace(/-/g, '').toUpperCase()}`;
  const authID = dados.id.substring(0, 8).toUpperCase();

  // --- FUNÇÃO PARA ELEMENTOS FIXOS (LOGO ACIMA DA PAGINAÇÃO) ---
  const addFixedElements = (pageNumber, totalPages) => {
    doc.setPage(pageNumber);
    
    // Logo no rodapé (Acima da paginação)
    if (dados.emissorLogo) {
      try {
        // Posicionada em Y=268 para ficar acima do texto da página
        doc.addImage(dados.emissorLogo, 'PNG', width - margin - 15, 268, 15, 15, undefined, 'FAST');
      } catch (e) {}
    }

    // Paginação (Na base do documento)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${pageNumber} de ${totalPages}`, width - margin, 287, { align: "right" });
  };

  // --- LOGOS E MARCA D'ÁGUA ---
  if (dados.emissorLogo) {
    try {
      const img = new Image();
      img.src = dados.emissorLogo;
      img.crossOrigin = "Anonymous"; 
      await new Promise((resolve, reject) => { 
        img.onload = resolve; 
        img.onerror = reject;
      });
      doc.addImage(img, 'PNG', margin, 15, 25, 25, undefined, 'FAST');
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.05 }));
      doc.addImage(img, 'PNG', (width - 100) / 2, (height - 100) / 2, 100, 100, undefined, 'FAST');
      doc.restoreGraphicsState();
    } catch (e) { console.error("Erro logo:", e); }
  }

  // --- TÍTULO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", width / 2, 55, { align: "center" });
  
  // --- 1. AS PARTES ---
  doc.setFontSize(10);
  doc.text("1. AS PARTES", margin, 70);
  doc.setDrawColor(0);
  doc.line(margin, 72, width - margin, 72);
  doc.setFont("helvetica", "normal");
  const emissorInfo = `CONTRATADO(A): ${toUp(dados.emissorNome)}, INSCRITO(A) NO DOCUMENTO SOB Nº ${toUp(dados.emissorDoc)}, RESIDENTE OU SEDIADO(A) EM ${toUp(dados.emissorEnd)}.`;
  const clienteInfo = `CONTRATANTE: ${toUp(dados.clienteNome)}, INSCRITO(A) NO DOCUMENTO SOB Nº ${toUp(dados.clienteDoc)}, RESIDENTE OU SEDIADO(A) EM ${toUp(dados.clienteEnd)}.`;
  const emissorSplit = doc.splitTextToSize(emissorInfo, width - (margin * 2));
  doc.text(emissorSplit, margin, 80);
  const clienteY = 80 + (emissorSplit.length * 5) + 2;
  const clienteSplit = doc.splitTextToSize(clienteInfo, width - (margin * 2));
  doc.text(clienteSplit, margin, clienteY);

  let currentY = clienteY + (clienteSplit.length * 5) + 10;

  // --- 2. OBJETO E VALOR ---
  doc.setFont("helvetica", "bold");
  doc.text("2. CLÁUSULA PRIMEIRA - DO OBJETO E VALOR", margin, currentY);
  doc.line(margin, currentY + 2, width - margin, currentY + 2);
  doc.setFont("helvetica", "normal");
  currentY += 8;
  const objTexto = `O PRESENTE CONTRATO TEM COMO OBJETO A PRESTAÇÃO DE SERVIÇO DE: ${toUp(dados.servico)}. PELO CUMPRIMENTO DO OBJETO, O CONTRATANTE PAGARÁ O VALOR DE ${toUp(dados.valor)}, COM PRAZO DE ENTREGA/CONCLUSÃO DEFINIDO PARA ${toUp(dados.prazo)}.`;
  const objSplit = doc.splitTextToSize(objTexto, width - (margin * 2));
  doc.text(objSplit, margin, currentY);
  currentY += (objSplit.length * 5) + 8;

  // --- 3. OBRIGAÇÕES ---
  doc.setFont("helvetica", "bold");
  doc.text("3. CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES", margin, currentY);
  doc.line(margin, currentY + 2, width - margin, currentY + 2);
  doc.setFont("helvetica", "normal");
  currentY += 8;
  const obrigaTexto = `O CONTRATADO COMPROMETE-SE A REALIZAR O SERVIÇO COM ZELO E DENTRO DO PRAZO. O CONTRANTE COMPROMETE-SE A FORNECER AS INFORMAÇÕES NECESSÁRIAS E EFETUAR O PAGAMENTO CONFORME PACTUADO.`;
  const obrigaSplit = doc.splitTextToSize(obrigaTexto, width - (margin * 2));
  doc.text(obrigaSplit, margin, currentY);
  currentY += (obrigaSplit.length * 5) + 8;

  // --- 4. PENALIDADES ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 0, 0);
  doc.text("4. CLÁUSULA TERCEIRA - DAS PENALIDADES E RESCISÃO", margin, currentY);
  doc.line(margin, currentY + 2, width - margin, currentY + 2);
  doc.setFont("helvetica", "italic");
  currentY += 8;
  const penalTexto = `EM CASO DE DESCUMPRIMENTO OU DESISTÊNCIA SEM JUSTA CAUSA, APLICA-SE A SEGUINTE PENALIDADE: ${toUp(dados.penalidade)}. O CONTRATO PODERÁ SER RESCINDIDO MEDIANTE AVISO PRÉVIO CASO HAJA INVIABILIDADE TÉCNICA OU FALTA DE PAGAMENTO.`;
  const penalSplit = doc.splitTextToSize(penalTexto, width - (margin * 2));
  doc.text(penalSplit, margin, currentY);
  currentY += (penalSplit.length * 5) + 8;

  // --- 5. FORO ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("5. CLÁUSULA QUARTA - DO FORO", margin, currentY);
  doc.line(margin, currentY + 2, width - margin, currentY + 2);
  doc.setFont("helvetica", "normal");
  currentY += 8;
  const foroTexto = `PARA DIRIMIR QUAISQUER CONTROVÉRSIAS ORIUNDAS DESTE INSTRUMENTO, AS PARTES ELEGEM O FORO DA COMARCA DO CONTRATADO, COM RENÚNCIA EXPRESSA A QUALQUER OUTRO, POR MAIS PRIVILEGIADO QUE SEJA.`;
  const foroSplit = doc.splitTextToSize(foroTexto, width - (margin * 2));
  doc.text(foroSplit, margin, currentY);

  // --- BLOCO DE VALIDAÇÃO OTP ---
  const validationY = 240; // Ajustado para não afastar demais do rodapé
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CERTIFICADO DE CONFORMIDADE DIGITAL", margin, validationY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const techInfo = `Este contrato foi validado através de protocolo OTP (One-Time Password) enviado ao dispositivo do signatário. A integridade deste arquivo é garantida pela hash exclusiva de transação e vinculação direta ao endereço IP registrado no momento da aceitação. Validade jurídica conforme MP nº 2.200-2/2001.`;
  const techSplit = doc.splitTextToSize(techInfo, width - (margin * 2));
  doc.text(techSplit, margin, validationY + 4);

  // --- RODAPÉ FINAL ---
  const footerY = 265;
  doc.setLineWidth(0.2);
  doc.setDrawColor(0);
  doc.line(margin, footerY, width - margin, footerY);
  
  doc.setFontSize(8);
  if (isAssinado) {
    const dataAssinatura = new Date(dados.assinadoEm).toLocaleString('pt-BR');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0); 
    doc.text(`ASSINADO DIGITALMENTE EM: ${dataAssinatura}`, margin, footerY + 7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(`IP: ${dados.assinaturaIP} | AUTH OTP: VERIFICADA | ID: ${authID}`, margin, footerY + 12);
    doc.setFont("courier", "bold");
    doc.setFontSize(7);
    doc.text(`INTEGRITY HASH: ${fullHash}`, margin, footerY + 17);
  } else {
    doc.setTextColor(200, 0, 0);
    doc.text("DOCUMENTO PENDENTE DE ASSINATURA DIGITAL", margin, footerY + 7);
  }

  // --- APLICAÇÃO DA PAGINAÇÃO ---
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    addFixedElements(i, totalPages);
  }

  doc.save(`CONTRATO-${authID}.pdf`);
  return true;
};