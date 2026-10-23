# Dutra’s Climatização

Landing page de captação de orçamentos e venda de aparelhos. HTML, CSS e JavaScript
puros, sem build e sem dependências. Para ver localmente, basta abrir o `index.html`.

```
index.html     conteúdo, SEO e dados estruturados (HVACBusiness)
styles.css     sistema visual completo
script.js      CONFIG do contato, mensagens, vitrine e filtros, menu, galeria
catalogo.js    LISTA DE EQUIPAMENTOS À VENDA (começa vazia de propósito)
img/           fotos em WebP e imagem de compartilhamento
favicon.svg    ícone da aba
```

---

## 1. Contato

Tudo fica no topo do `script.js`:

```js
const CONFIG = {
  contato: 'https://bit.ly/Contato_DutrasClimatizacao',
  whatsapp: '',   // opcional: '55' + DDD + número, só dígitos
};
```

- O link oficial da bio leva a um **link de mensagem do WhatsApp Business**
  (`wa.me/message/...`). Ele abre a conversa com a mensagem que a própria empresa
  configurou e **não mostra o número**, por isso não dá para pré-preencher uma
  mensagem diferente por botão.
- **Hoje** todos os 16 botões abrem esse link oficial.
- **Se a Dutra’s passar o número**, preencha `whatsapp`: cada botão passa a abrir o
  WhatsApp com a mensagem do serviço (instalação, higienização, manutenção, novos,
  seminovos, dúvida...) e o botão de cada aparelho da vitrine manda marca, modelo,
  BTUs e condição. As mensagens estão em `MESSAGES`.
- Os links do `index.html` já apontam para o bit.ly, então o contato funciona mesmo
  sem JavaScript.

## 2. Vitrine de equipamentos (`catalogo.js`)

O arquivo explica o formato no topo. Cada aparelho:

```js
{ marca: 'Marca', modelo: 'Modelo', condicao: 'novo', btus: 12000,
  preco: 2499.90, disponibilidade: 'Disponível', foto: 'img/equipamentos/x.webp' },
```

- `marca`, `modelo`, `condicao` (`'novo'` ou `'seminovo'`) e `btus` são obrigatórios;
  um item incompleto é ignorado (com aviso no console do navegador).
- Sem `preco`, o card mostra "Consulte o valor". Sem `disponibilidade`, "Consulte".
  Sem `foto`, aparece o ícone de ar-condicionado.
- **Lista vazia (hoje):** a seção mostra os blocos "Aparelhos novos" e "Aparelhos
  seminovos", cada um com botão de consulta. Nenhum produto fictício vai ao ar.
- **Filtros aparecem sozinhos:** "Todos / Novos / Seminovos" quando houver os dois
  tipos, e o de capacidade quando houver pelo menos duas capacidades diferentes.
- Fotos dos aparelhos: de preferência quadradas, ~800x800 em WebP, na pasta
  `img/equipamentos/`.

Cadastre só aparelhos reais e confirmados pela empresa (modelo, BTUs, preço e estoque).

## 3. Antes de publicar

| # | O que | Onde |
|---|---|---|
| 1 | Domínio | `index.html`: `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD (marcados `TROCAR`). Hoje: `https://dutrasclimatizacao.com.br/` |
| 2 | **Cidade de atendimento** | não aparece no perfil público, então o site não cita localidade. Quando confirmada, entre no `<title>`, na `description`, no hero e no JSON-LD (`address`/`areaServed`) para o SEO local |
| 3 | Fotos reais e logotipo | ver seção 4. O logotipo atual ("D" no quadrado azul) é provisório |
| 4 | Catálogo | ver seção 2 |

## 4. Trocar as fotos

Todas as fotos atuais são de banco (Pexels e Unsplash). A galeria avisa "Imagens
ilustrativas" e o rodapé cita a origem. **Esses avisos só saem quando as fotos forem da
Dutra’s** (o Instagram tem instalações e aparelhos).

| Arquivo | Onde |
|---|---|
| `hero-1600.webp` + `hero-900.webp` | hero (recorte quase quadrado; o aparelho deve ficar à direita) |
| `marca.webp` | seção azul "A solução certa para cada ambiente" |
| `gal-*.webp` + `gal-*-lg.webp` | galeria (a `-lg` abre ampliada); `gal-madeira` é o quadro largo |
| `og.jpg` | prévia ao compartilhar, 1200x630 |

Converter: `ffmpeg -i foto.jpg -vf scale=900:-2 -c:v libwebp -quality 76 gal-x.webp`

## 5. Decisões do projeto

- **Cores:** azul profundo `#170A91` nas seções de marca, CTA e rodapé; azul elétrico
  `#3448F5` em botões, chips e destaques; azul-claro `#EEF0FF` em superfícies.
- **Forma:** botões e controles com 12px, cards e fotos com 24px, chips em pílula.
  Números das etapas em contorno, com uma linha discreta ligando as três.
- **Nada inventado:** sem endereço, telefone, cidade, preços, marcas, garantias,
  avaliações ou tempo de mercado.
- **Sem listener de scroll**: tudo por `IntersectionObserver`. Movimento reduzido é
  respeitado.
- **Celular:** barra fixa "Solicitar orçamento" depois dos botões do hero, some no CTA
  final; o `body` reserva o espaço dela. No desktop, botão flutuante.
