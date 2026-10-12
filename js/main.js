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
  const endereco = (data.get('endereco') || '').trim();
  const servico = (data.get('servico') || '').trim();
  const mensagem = (data.get('mensagem') || '').trim();

  let texto = 'Ola! Gostaria de um orçamento.\n';
  if (nome) texto += `Nome: ${nome}\n`;
  if (telefone) texto += `Telefone: ${telefone}\n`;
  if (endereco) texto += `Endereço do orçamento: ${endereco}\n`;
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
