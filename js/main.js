/**
 * Jan Surzycki (1898–1921) — strona pamięci
 * Obsługa: wielkość tekstu, motyw jasny/ciemny, menu mobilne,
 * podświetlanie aktywnej sekcji, filtry archiwum, powiększanie zdjęć.
 */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // ---------- Wielkość tekstu (0–3, domyślnie 1) ----------
  const setSize = (n) => {
    const s = Math.max(0, Math.min(3, n));
    root.dataset.size = String(s);
    try { localStorage.setItem('js_size', String(s)); } catch (e) {}
  };
  const currentSize = () => parseInt(root.dataset.size || '1', 10);
  document.querySelector('[data-action="smaller"]')?.addEventListener('click', () => setSize(currentSize() - 1));
  document.querySelector('[data-action="larger"]')?.addEventListener('click', () => setSize(currentSize() + 1));

  // ---------- Motyw jasny / ciemny ----------
  const themeBtn = document.querySelector('[data-action="theme"]');
  const syncThemeBtn = () => {
    const dark = root.dataset.theme === 'dark';
    themeBtn?.setAttribute('aria-pressed', String(dark));
    themeBtn?.setAttribute('title', dark ? 'Włącz wersję jasną' : 'Włącz wersję ciemną');
  };
  themeBtn?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('js_theme', root.dataset.theme); } catch (e) {}
    syncThemeBtn();
  });
  syncThemeBtn();

  // ---------- Menu na telefonie ----------
  const nav = document.getElementById('nav');
  const menuBtn = document.querySelector('.menu-btn');
  menuBtn?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  }));

  // ---------- Podświetlenie aktywnej sekcji w menu ----------
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.remove('active'));
          byId.get(en.target.id)?.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  // ---------- Filtry archiwum ----------
  const filterBtns = document.querySelectorAll('.filters button');
  const items = document.querySelectorAll('.archive .fig');
  filterBtns.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    items.forEach((it) => { it.hidden = !(f === 'all' || it.dataset.cat === f); });
  }));

  // ---------- Powiększanie zdjęć ----------
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  let list = [];
  let idx = 0;

  const visibleZooms = () => [...document.querySelectorAll('a.zoom')].filter((a) => !a.closest('[hidden]'));
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const a = list[idx];
    lbImg.src = a.getAttribute('href');
    lbImg.alt = a.querySelector('img')?.alt || '';
    lbCap.textContent = a.dataset.caption || a.querySelector('img')?.alt || '';
  };
  const open = (a) => {
    list = visibleZooms();
    show(Math.max(0, list.indexOf(a)));
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  };
  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  document.querySelectorAll('a.zoom').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    open(a);
  }));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
});
