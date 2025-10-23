// form.js — validação e envio dos dados
export function initForm(callbackAddUser) {
  const form = document.getElementById('form-usuario');
  const campos = {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    idade: document.getElementById('idade'),
    cargo: document.getElementById('cargo'),
  };

  // Adiciona spans de erro logo após cada input
  Object.values(campos).forEach(campo => {
    let span = document.createElement('span');
    span.className = 'erro';

    // garante que o span fique sempre logo abaixo do input
    if (!campo.nextElementSibling || !campo.nextElementSibling.classList.contains('erro')) {
      campo.insertAdjacentElement('afterend', span);
    }
  });

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    limparErros();
    let valido = true;

    const nome = campos.nome.value.trim();
    const email = campos.email.value.trim();
    const idade = campos.idade.value.trim();
    const cargo = campos.cargo.value.trim();

    if (!nome) {
      mostrarErro(campos.nome, 'O nome é obrigatório.');
      valido = false;
    }

    if (!email) {
      mostrarErro(campos.email, 'O e-mail é obrigatório.');
      valido = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      mostrarErro(campos.email, 'Formato de e-mail inválido.');
      valido = false;
    }

    if (!idade) {
      mostrarErro(campos.idade, 'A idade é obrigatória.');
      valido = false;
    } else if (isNaN(idade) || idade < 16 || idade > 120) {
      mostrarErro(campos.idade, 'Idade inválida (entre 16 e 120).');
      valido = false;
    }

    if (!cargo) {
      mostrarErro(campos.cargo, 'O cargo é obrigatório.');
      valido = false;
    }

    if (!valido) return;

    const usuario = {
      id: gerarIdUnico(),
      nome,
      email,
      idade: Number(idade),
      cargo
    };

    if (typeof callbackAddUser === 'function') {
      callbackAddUser(usuario);
    }

    form.reset();
    limparErros();
    campos.nome.focus();
  });

  // Remove a mensagem de erro ao digitar
  Object.values(campos).forEach(campo => {
    campo.addEventListener('input', () => {
      const erroSpan = campo.parentNode.querySelector('.erro');
      if (erroSpan) erroSpan.textContent = '';
      campo.classList.remove('invalido');
    });
  });
}

// ---------- Funções auxiliares ----------
function mostrarErro(campo, mensagem) {
  let erroSpan = campo.nextElementSibling;
  if (!erroSpan || !erroSpan.classList.contains('erro')) {
    // caso não exista, cria
    erroSpan = document.createElement('span');
    erroSpan.className = 'erro';
    campo.insertAdjacentElement('afterend', erroSpan);
  }
  erroSpan.textContent = mensagem;
  campo.classList.add('invalido');
}

function limparErros() {
  document.querySelectorAll('.erro').forEach(span => (span.textContent = ''));
  document.querySelectorAll('.invalido').forEach(el => el.classList.remove('invalido'));
}

function gerarIdUnico() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
