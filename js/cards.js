// cards.js — mantém array de usuários, renderização, remoção e filtro
const listaEl = document.getElementById('lista-usuarios');
const filtroEl = document.getElementById('filtro');

let usuarios = []; // array global do módulo

// inicializa o módulo
export function initCards() {
  // opcional: carregar do localStorage (ou deixar vazio)
  const raw = localStorage.getItem('usuarios_cards_v1');
  if (raw && usuarios.length === 0) {
    try {
      usuarios = JSON.parse(raw);
    } catch (e) {
      usuarios = [];
    }
  }

  renderizarCards();

  // filtro dinâmico
  filtroEl.addEventListener('input', () => {
    const termo = filtroEl.value.trim().toLowerCase();
    aplicarFiltro(termo);
  });
}

// adicionar usuário ao array e renderizar todos
export function addUserToCards(usuario) {
  usuarios.unshift(usuario); // adiciona no topo
  salvarStorage();
  renderizarCards();
}

// salvar no localStorage (opcional)
function salvarStorage() {
  try {
    localStorage.setItem('usuarios_cards_v1', JSON.stringify(usuarios));
  } catch (e) {
    // se storage indisponível, ignore
  }
}

// renderiza todos os cards
function renderizarCards() {
  listaEl.innerHTML = '';

  if (!usuarios.length) {
    const vazio = document.createElement('div');
    vazio.className = 'vazio';
    vazio.textContent = 'Nenhum usuário cadastrado. Use o formulário para adicionar.';
    listaEl.appendChild(vazio);
    return;
  }

  usuarios.forEach(usuario => {
    const card = criarCard(usuario);
    listaEl.appendChild(card);
  });

  // aplica filtro atual
  aplicarFiltro(filtroEl.value.trim().toLowerCase());
}

// cria um card individual
function criarCard(usuario) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = usuario.id;

  const titulo = document.createElement('h3');
  titulo.textContent = usuario.nome;

  const metaCargo = document.createElement('p');
  metaCargo.className = 'meta';
  metaCargo.textContent = `${usuario.cargo} • ${usuario.idade} anos`;

  const emailP = document.createElement('p');
  emailP.textContent = usuario.email;

  const dica = document.createElement('p');
  dica.className = 'remover-info';
  dica.textContent = 'Dê duplo clique no card para remover.';

  card.append(titulo, metaCargo, emailP, dica);

  // remoção por dblclick
  card.addEventListener('dblclick', () => {
    const confirmado = confirm(`Remover ${usuario.nome} do painel?`);
    if (!confirmado) return;

    usuarios = usuarios.filter(u => u.id !== usuario.id);
    salvarStorage();

    // animação simples
    card.style.transition = 'opacity .25s ease, transform .25s ease';
    card.style.opacity = '0';
    card.style.transform = 'scale(.98)';
    setTimeout(() => renderizarCards(), 260);
  });

  return card;
}

// aplica filtro por nome
function aplicarFiltro(termo) {
  const cards = Array.from(listaEl.querySelectorAll('.card'));
  if (!termo) {
    cards.forEach(c => c.style.display = '');
    return;
  }

  cards.forEach(card => {
    const nome = (card.querySelector('h3')?.textContent || '').toLowerCase();
    card.style.display = nome.includes(termo) ? '' : 'none';
  });

  // mensagem se nenhum card visível
  const visiveis = cards.filter(c => c.style.display !== 'none');
  let mensagemExistente = listaEl.querySelector('.vazio.filtro');
  if (visiveis.length === 0) {
    if (!mensagemExistente) {
      const msg = document.createElement('div');
      msg.className = 'vazio filtro';
      msg.textContent = 'Nenhum usuário corresponde ao filtro.';
      listaEl.appendChild(msg);
    }
  } else if (mensagemExistente) {
    mensagemExistente.remove();
  }
}
