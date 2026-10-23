/* =========================================================================
   CATALOGO DE EQUIPAMENTOS DA DUTRA'S
   Cadastre aqui SO aparelhos reais, com dados confirmados pela empresa.
   Enquanto a lista estiver vazia, o site mostra os blocos "Aparelhos novos" e
   "Aparelhos seminovos" com botao de consulta (nenhum produto ficticio).

   Cada aparelho e um bloco { ... } dentro dos colchetes, separados por virgula:

   {
     marca: 'Marca',                 // obrigatorio
     modelo: 'Modelo',               // obrigatorio
     condicao: 'novo',               // obrigatorio: 'novo' ou 'seminovo'
     btus: 12000,                    // obrigatorio: numero, sem ponto
     preco: 2499.90,                 // opcional; sem preco, mostra "Consulte o valor"
     disponibilidade: 'Disponível',  // opcional; texto livre (ex.: 'Últimas unidades')
     foto: 'img/equipamentos/nome-do-arquivo.webp', // opcional
   },

   Os filtros aparecem sozinhos: "Novos / Seminovos" quando houver os dois tipos,
   e o de capacidade quando houver pelo menos duas capacidades diferentes.
   Fotos: de preferencia quadradas, ~800x800, em img/equipamentos/.
   ========================================================================= */
window.CATALOGO = [
];
