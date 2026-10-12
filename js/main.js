/* =========================================================
   Pontual Limpeza e Manutenção de Terrenos — interações
   ========================================================= */

// ---------- Configuração ----------
// Troque pelo número real (só dígitos, com 55 do Brasil).
const WHATSAPP_NUMBER = '5567996166289';

// ---------- Menu mobile ----------
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------- Abas de serviços ----------
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('is-active'));
    panels.forEach((p) => p.classList.remove('is-active'));
    tab.classList.add('is-active');
    const panel = document.getElementById(tab.dataset.tab);
    if (panel) panel.classList.add('is-active');
  });
});

// ---------- Formulários -> WhatsApp ----------
function buildWhatsMessage(form) {
  const data = new FormData(form);
  const nome = (data.get('nome') || '').trim();
  const telefone = (data.get('telefone') || '').trim();
  const rua = (data.get('rua') || '').trim();
  const bairro = (data.get('bairro') || '').trim();
  const cidade = (data.get('cidade') || '').trim();
  const servico = (data.get('servico') || '').trim();
  const mensagem = (data.get('mensagem') || '').trim();

  let texto = 'Ola! Gostaria de um orçamento.\n';
  if (nome) texto += `Nome: ${nome}\n`;
  if (telefone) texto += `Telefone: ${telefone}\n`;
  if (rua || bairro || cidade) texto += `Endereço do orçamento: ${[rua, bairro, cidade].filter(Boolean).join(' — ')}\n`;
  if (servico) texto += `Servico: ${servico}\n`;
  if (mensagem) texto += `Detalhes: ${mensagem}\n`;
  return texto;
}

document.querySelectorAll('#quoteForm, #contactForm').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const texto = buildWhatsMessage(form);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
});

// ---------- "Pedir orçamento" de um setor -> pré-seleciona o serviço ----------
const SERVICO_MAP = {
  limpeza: 'Limpeza de terreno',
  rocada: 'Roçada e Manutenção',
  cercas: 'Construção de cercas',
  poda: 'Corte de árvores',
  manutencao: 'Manutenção em geral',
  pa: 'Pá carregadeira e demolição'
};

document.querySelectorAll('.tab-panel .btn[href="#contato"]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panelId = btn.closest('.tab-panel').id;
    const servico = SERVICO_MAP[panelId];
    const select = document.getElementById('cf-servico');
    if (servico && select) select.value = servico;
  });
});

// ---------- Ano no rodapé ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Galeria (auto) ----------
const GALLERY = {
  user: 'pontuallimpeza',
  repo: 'pontual-limpeza',
  folder: 'galeria'
};

function prettify(name) {
  return name.replace(/[-_.]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}

async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  try {
    const url = `https://api.github.com/repos/${GALLERY.user}/${GALLERY.repo}/contents/${GALLERY.folder}?ref=main`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Nao foi possivel carregar a galeria');
    const files = await res.json();
    if (!Array.isArray(files) || files.length === 0) {
      grid.innerHTML = '<p class="gallery-empty">Nenhuma foto ainda. Adicione na pasta galeria/.</p>';
      return;
    }
    const imgs = files.filter(f =>
      f.type === 'file' &&
      /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name) &&
      !/^LEIA-ME\.txt$/i.test(f.name)
    );
    if (imgs.length === 0) {
      grid.innerHTML = '<p class="gallery-empty">Nenhuma foto ainda. Adicione na pasta galeria/.</p>';
      return;
    }
    imgs.sort((a,b) => a.name.localeCompare(b.name));
    const used = new Set();
    let html = '';
    for (const f of imgs) {
      if (used.has(f.name)) continue;
      const m = f.name.match(/^(.+)-(antes|before)\.(jpe?g|png|webp|gif)$/i);
      if (m) {
        const base = m[1];
        const ext = m[3].toLowerCase();
        const mapa = {'jpg':'jpg','jpeg':'jpg','png':'png','webp':'webp','gif':'gif'};
        const outros = imgs.filter(o =>
          !used.has(o.name) &&
          new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}-(depois|after)\\.${mapa[ext]||ext}$`, 'i').test(o.name)
        );
        if (outros.length > 0) {
          const d = outros[0];
          used.add(f.name); used.add(d.name);
          html += `<figure class="g-item g-pair">
            <div class="g-half"><img src="${f.download_url}" alt="${base} - antes" loading="lazy"><span class="g-tag">Antes</span></div>
            <div class="g-half"><img src="${d.download_url}" alt="${base} - depois" loading="lazy"><span class="g-tag">Depois</span></div>
          </figure>`;
          continue;
        }
      }
      used.add(f.name);
      html += `<figure class="g-item g-single">
        <img src="${f.download_url}" alt="${f.name}" loading="lazy">
        <figcaption>${prettify(f.name.replace(/\.(jpe?g|png|webp|gif)$/i,''))}</figcaption>
      </figure>`;
    }
    grid.innerHTML = html;
  } catch (e) {
    grid.innerHTML = '<p class="gallery-empty">Erro ao carregar galeria.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
