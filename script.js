/* =========================================================================
   CONFIGURACAO: o unico lugar para mexer no contato.
   contato:  link oficial da bio (bit.ly que abre o WhatsApp Business da Dutra's).
             Ele usa a mensagem configurada pela propria empresa.
   whatsapp: opcional. Com o numero (so digitos, 55 + DDD + numero), cada botao
             passa a abrir o WhatsApp com a mensagem do servico ou do aparelho.
   ========================================================================= */
const CONFIG = {
  contato: 'https://bit.ly/Contato_DutrasClimatizacao',
  whatsapp: '',
};

const MESSAGES = {
  geral: 'Olá! Conheci a Dutra’s Climatização pelo site e gostaria de solicitar um orçamento.',
  instalacao: 'Olá! Vim pelo site e gostaria de um orçamento de instalação de ar-condicionado.',
  higienizacao: 'Olá! Vim pelo site e gostaria de consultar a higienização do meu ar-condicionado.',
  manutencao: 'Olá! Vim pelo site e gostaria de solicitar manutenção do meu ar-condicionado.',
  novos: 'Olá! Vim pelo site e gostaria de consultar os aparelhos de ar-condicionado novos disponíveis.',
  seminovos: 'Olá! Vim pelo site e gostaria de consultar os aparelhos de ar-condicionado seminovos disponíveis.',
  falar: 'Olá! Vim pelo site e gostaria de falar com a Dutra’s Climatização.',
  duvida: 'Olá! Vim pelo site e tenho uma dúvida.',
};

(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Contato ----------
  const phone = String(CONFIG.whatsapp).replace(/\D/g, '');
  const hasWhatsApp = /^55\d{10,11}$/.test(phone);
  if (CONFIG.whatsapp && !hasWhatsApp) console.warn('CONFIG.whatsapp invalido: use so digitos, com 55 + DDD + numero.');
  const contactUrl = (text) => (hasWhatsApp ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : CONFIG.contato);
  $$('[data-contact]').forEach((a) => { a.href = contactUrl(MESSAGES[a.dataset.contact] || MESSAGES.geral); });

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Vitrine de equipamentos (dados em catalogo.js) ----------
  const CONDITION = { novo: 'Novo', seminovo: 'Seminovo' };
  const items = (Array.isArray(window.CATALOGO) ? window.CATALOGO : []).filter((p) => {
    const ok = p && p.marca && p.modelo && CONDITION[p.condicao] && Number(p.btus) > 0;
    if (!ok) console.warn('Item do catalogo ignorado (faltam marca, modelo, condicao ou btus):', p);
    return ok;
  });

  if (items.length) {
    const list = $('.products');
    const none = $('.products__none');
    const tpl = $('#product-tpl');
    const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    const btusLabel = (n) => `${Number(n).toLocaleString('pt-BR')} BTUs`;
    const state = { condicao: 'todos', btus: '' };

    $('.shop__empty').hidden = true;
    list.hidden = false;

    const cards = items.map((p) => {
      const li = tpl.content.firstElementChild.cloneNode(true);
      const name = `${p.marca} ${p.modelo}`;
      if (p.foto) {
        const img = document.createElement('img');
        img.src = p.foto; img.alt = name; img.loading = 'lazy'; img.decoding = 'async';
        $('.product__media', li).replaceChildren(img);
      }
      const badge = $('.product__badge', li);
      badge.textContent = CONDITION[p.condicao];
      badge.classList.toggle('is-new', p.condicao === 'novo');
      $('.product__name', li).textContent = name;
      $('.product__btus', li).textContent = btusLabel(p.btus);
      $('.product__stock', li).textContent = p.disponibilidade || 'Consulte';
      const price = $('.product__price', li);
      const value = Number(p.preco);
      if (p.preco != null && value > 0) price.textContent = money.format(value);
      else { price.textContent = 'Consulte o valor'; price.classList.add('is-ask'); }
      const cta = $('.product__cta', li);
      cta.href = contactUrl(`Olá! Vim pelo site e gostaria de consultar o ar-condicionado ${name}, ${btusLabel(p.btus)} (${CONDITION[p.condicao].toLowerCase()}).`);
      cta.setAttribute('aria-label', `Consultar ${name} pelo WhatsApp`);
      list.append(li);
      return { li, p };
    });

    // Filtros so aparecem quando ha o que filtrar
    const conditions = new Set(items.map((p) => p.condicao));
    const capacities = [...new Set(items.map((p) => Number(p.btus)))].sort((a, b) => a - b);
    const condGroup = $('[data-filter-condition]');
    const btusBox = $('[data-filter-btus]');
    const select = $('select', btusBox);
    condGroup.hidden = conditions.size < 2;
    btusBox.hidden = capacities.length < 2;
    $('.filters').hidden = condGroup.hidden && btusBox.hidden;
    capacities.forEach((n) => select.append(new Option(btusLabel(n), String(n))));

    const apply = () => {
      let shown = 0;
      cards.forEach(({ li, p }) => {
        const visible = (state.condicao === 'todos' || p.condicao === state.condicao)
          && (!state.btus || String(Number(p.btus)) === state.btus);
        li.hidden = !visible;
        if (visible) shown += 1;
      });
      none.hidden = shown > 0;
      $$('.chip', condGroup).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.condition === state.condicao)));
      select.value = state.btus;
    };
    $$('.chip', condGroup).forEach((chip) => chip.addEventListener('click', () => { state.condicao = chip.dataset.condition; apply(); }));
    select.addEventListener('change', () => { state.btus = select.value; apply(); });
    $('[data-reset]').addEventListener('click', () => { state.condicao = 'todos'; state.btus = ''; apply(); });
    apply();
  }

  // ---------- Rolagem: tudo por IntersectionObserver, sem listener de scroll ----------
  if (!('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    root.classList.add('is-past-hero');
  } else {
    const header = $('.header');
    new IntersectionObserver(([e]) => header.classList.toggle('is-scrolled', !e.isIntersecting))
      .observe($('.top-sentinel'));

    new IntersectionObserver(([e]) => {
      root.classList.toggle('is-past-hero', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe($('.hero__actions'));

    const atCta = new Set();
    const ctaObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? atCta.add(e.target) : atCta.delete(e.target)));
      root.classList.toggle('is-at-cta', atCta.size > 0);
    });
    ctaObs.observe($('.cta'));
    ctaObs.observe($('.footer'));

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        reveal.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach((el) => reveal.observe(el));
  }

  // ---------- Menu do celular ----------
  const header = $('.header');
  const menuBtn = $('.menu-btn');
  const menu = $('#menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('use', menuBtn).setAttribute('href', open ? '#i-x' : '#i-menu-2');
    header.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // ---------- Galeria ampliada ----------
  const box = $('.lightbox');
  const gallery = $$('.g__btn');
  if (!box || !gallery.length || typeof box.showModal !== 'function') return;
  const img = $('.lightbox__img', box);
  const cap = $('.lightbox__cap', box);
  let index = 0;
  const show = (i) => {
    index = (i + gallery.length) % gallery.length;
    const item = gallery[index];
    img.src = item.dataset.full;
    img.alt = $('img', item).alt;
    cap.textContent = `${item.dataset.caption}  ·  ${index + 1} de ${gallery.length}`;
  };
  gallery.forEach((item, i) => item.addEventListener('click', () => { show(i); box.showModal(); }));
  $('.lightbox__close', box).addEventListener('click', () => box.close());
  $('.lightbox__prev', box).addEventListener('click', () => show(index - 1));
  $('.lightbox__next', box).addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  let startX = null;
  box.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  box.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 48) show(index + (dx < 0 ? 1 : -1));
  });
})();
